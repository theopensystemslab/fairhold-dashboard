import { z } from "zod";
import { isValid as isValidPostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { maintenanceLevelSchema } from "../schemas/calculationSchema";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "Postcode is required")
    .refine(isValidPostcode, "Invalid postcode"),
  houseSize: z.coerce
    .string()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional()
    .refine((value) => value === undefined || value > 0, {
      message: "House size must be a positive number",
    }),
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
