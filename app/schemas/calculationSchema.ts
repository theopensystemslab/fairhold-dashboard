import { z } from "zod";
import { parse as parsePostcode, isValid as isValidPostcode, validOutcode as isValidOutcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { MAINTENANCE_LEVELS } from "../models/constants";

// a common interface that can be used regardless if user enteres full or outward postcode
export interface PostcodeScales {
  outcode: string;
  incode: string | null;
  area: string;
  district: string;
  sector: string | null;
  postcode: string | null;
}

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const maintenanceLevelSchema = z.enum(
  Object.keys(MAINTENANCE_LEVELS) as [
    keyof typeof MAINTENANCE_LEVELS,
    ...Array<keyof typeof MAINTENANCE_LEVELS>,
  ]
);

export const calculationSchema = z
  .object({
    housePostcode: z
      .string()
      .min(1, "housePostcode is required")
      .refine(                                               
        (postcode) => isValidPostcode(postcode) || isValidOutcode(postcode),
        "Enter a valid full postcode or outcode"
      )                                                      
      .transform((postcode): PostcodeScales => {
        if (isValidPostcode(postcode)) {
          const parsed = parsePostcode(postcode) as PostcodeScales;
          return {
            outcode: parsed.outcode,
            incode: parsed.incode,
            area: parsed.area,
            district: parsed.district,
            sector: parsed.sector,
            postcode: parsed.postcode
          };
        } else {
          const outcodeUpper = postcode.toUpperCase();
          const districtMatch = outcodeUpper.match(/^[A-Z]+\d+/);
          const district = districtMatch ? districtMatch[0] : outcodeUpper;
          const areaMatch = outcodeUpper.match(/^[A-Z]+/);
          const area = areaMatch ? areaMatch[0] : outcodeUpper.charAt(0);
          
          return {
            outcode: outcodeUpper,
            incode: null,
            area: area,
            district: district,
            sector: null,
            postcode: null
          } as PostcodeScales;
        }
      }),
    houseBedrooms: z.coerce
      .number()
      .positive("houseBedrooms must be a positive integer"),
    houseAge: z.coerce
      .number()
      .nonnegative("houseAge must be a positive integer or 0"),
    houseType: HouseTypeEnum.refine(
      (value) => HouseTypeEnum.options.includes(value),
      {
        message: `houseType is required and must be one of ${HOUSE_TYPES}`,
      }
    ),
    maintenanceLevel: maintenanceLevelSchema,
  })

  export type Calculation = z.infer<typeof calculationSchema>;