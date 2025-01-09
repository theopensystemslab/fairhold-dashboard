import { z } from "zod";
import { isValid as isValidPostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { maintenancePercentageSchema } from "../schemas/calculationSchema";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

/**
 * Describes the form the user will interact with in the frontend
 */
export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "Postcode is required")
    .refine(isValidPostcode, "Invalid postcode"),
  houseSize: z.coerce.number().positive("House size must be a positive number"),
  houseAge: z.coerce.number().positive("House age must be a positive number"),
  houseBedrooms: z.coerce
    .number()
    .positive("House bedrooms must be a positive number"),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `House type is required`,
    }
  ),
  maintenancePercentage: maintenancePercentageSchema,
});

export type FormFontend = z.infer<typeof formSchema>;
