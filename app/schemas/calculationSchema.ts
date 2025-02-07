import { z } from "zod";
import { parse as parsePostcode, isValid as isValidPostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { MAINTENANCE_LEVELS } from "../models/constants";

export type ValidPostcode = Extract<
  ReturnType<typeof parsePostcode>,
  { valid: true }
>;

const HouseTypeEnum = z.enum(HOUSE_TYPES);
function assignHouseSize(numberOfBedrooms: number) {
  const sizeMapping: { [key: number]: number } = {
    1: 55,
    2: 70,
    3: 95,
    4: 110,
    5: 125,
    6: 135,
  };

  const size = numberOfBedrooms > 6 ? 135 : sizeMapping[numberOfBedrooms];
  return size;
}

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
      .refine(isValidPostcode, "Invalid postcode")
      .transform(parsePostcode)
      .refine((postcode): postcode is ValidPostcode => postcode.valid),
    houseBedrooms: z.coerce
      .number()
      .positive("houseBedrooms must be a positive integer"),
    houseSize: z.coerce.number(),
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
  .superRefine((data) => {
    if (data.houseSize === undefined) {
      data.houseSize = assignHouseSize(data.houseBedrooms);
    }
  });

export type Calculation = z.infer<typeof calculationSchema>;
