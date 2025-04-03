import { z } from "zod";
import { isValid as isValidPostcode, validOutcode as isValidOutcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { maintenanceLevelSchema } from "../schemas/calculationSchema";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "Enter a postcode")
    .refine(
      (postcode) => isValidPostcode(postcode) || isValidOutcode(postcode), 
      "Enter a valid postcode (e.g. SW1 1AA) or outcode (e.g. SW1)"
    ),
  houseAge: z.coerce
    .number()
    .nonnegative("House age must be a positive number or 0"),
  houseBedrooms: z.coerce
    .number()
    .positive("House bedrooms must be a positive number"),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `House type is required`,
    }
  ),
  maintenanceLevel: maintenanceLevelSchema,
});

export type FormFrontend = z.infer<typeof formSchema>;
