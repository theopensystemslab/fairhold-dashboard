import { z } from "zod";
import { isValid as isValidPostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { maintenanceLevelSchema } from "../schemas/calculationSchema";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "Enter a postcode.")
    .refine(isValidPostcode, "Enter a valid postcode."),
  houseSize: z.coerce
    .string()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional()
    .refine((value) => value === undefined || value > 0, {
      message: "Enter a positive house size.",
    }),
  houseAge: z
    .string({
      required_error: "Enter an estimated build year.",
      invalid_type_error: "Enter a valid estimated build year."
    })
    .transform((val) => {
      if (!val) return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? undefined : parsed;
    })
    .pipe(
      z.number({
        invalid_type_error: "Enter a valid number for house age."
      })
      .nonnegative("Enter a positive number or 0.")
    ),
  houseBedrooms: z
    .string({
      required_error: "Enter the number of bedrooms.",
      invalid_type_error: "Enter a valid number of bedrooms."
    })
    .transform((val) => {
      if (!val) return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? undefined : parsed;
    })
    .pipe(
      z.number({
        invalid_type_error: "Enter a valid number of bedrooms."
      })
      .positive("Enter a positive number.")
    ),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `Enter a house type.`,
    }
  ),
  maintenanceLevel: maintenanceLevelSchema,
});

export type FormFrontend = z.infer<typeof formSchema>;
