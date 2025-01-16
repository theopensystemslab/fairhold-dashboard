import { z } from "zod";
import {
  parse as parsePostcode,
  isValid as isValidPostcode,
} from "postcode";
import { 
  HOUSE_TYPES 
} from "../models/Property";
import { MAINTENANCE_LEVELS } from "../models/constants";

export type ValidPostcode = Extract<
  ReturnType<typeof parsePostcode>,
  { valid: true }
>;

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const maintenanceLevelSchema = z.enum(Object.keys(MAINTENANCE_LEVELS) as [keyof typeof MAINTENANCE_LEVELS, ...Array<keyof typeof MAINTENANCE_LEVELS>]);

export const calculationSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "housePostcode is required")
    .refine(isValidPostcode, "Invalid postcode")
    .transform(parsePostcode)
    .refine((postcode): postcode is ValidPostcode => postcode.valid),
  houseSize: z.coerce.number().positive("houseSize must be a positive integer"),
  houseAge: z.coerce
    .number()
    .nonnegative("houseAge must be a positive integer or 0"),
  houseBedrooms: z.coerce
    .number()
    .positive("houseBedrooms must be a positive integer"),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `houseType is required and must be one of ${HOUSE_TYPES}`,
    }
  ),
  maintenanceLevel: maintenanceLevelSchema,
});

export type Calculation = z.infer<typeof calculationSchema>;
