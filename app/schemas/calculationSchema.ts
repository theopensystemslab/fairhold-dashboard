import { z } from "zod";
import {
  parse as parsePostcode,
  isValid as isValidPostcode,
} from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { MAINTENANCE_LEVELS } from "../models/constants";

// Type not exported by postcode lib directly
type ValidPostcode = Extract<ReturnType<typeof parsePostcode>, { valid: true }>;

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const maintenancePercentageSchema = z.number().refine(
  (value): value is typeof MAINTENANCE_LEVELS[number] => 
    MAINTENANCE_LEVELS.includes(value as typeof MAINTENANCE_LEVELS[number]),
  {
    message: `Maintenance percentage must be one of: ${MAINTENANCE_LEVELS.join(', ')}`
  }
);

/**
 * Describes the form the user will interact with in the frontend
 */
export const calculationSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "housePostcode is required")
    .refine(isValidPostcode, "Invalid postcode")
    .transform(parsePostcode)
    .refine((postcode): postcode is ValidPostcode => postcode.valid),
  houseSize: z.coerce.number().positive("houseSize must be a positive integer"),
  houseAge: z.coerce.number().positive("houseAge must be a positive integer"),
  houseBedrooms: z.coerce
    .number()
    .positive("houseBedrooms must be a positive integer"),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `houseType is required and must be one of ${HOUSE_TYPES}`,
    }
  ),
  maintenancePercentage: maintenancePercentageSchema,
});

export type Calculation = z.infer<typeof calculationSchema>;
