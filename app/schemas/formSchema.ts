import { z } from "zod";
import { isValid as isValidPostcode, validOutcode as isValidOutcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { maintenanceLevelSchema } from "../schemas/calculationSchema";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "Enter a postcode.")
    .refine(
      (postcode) => isValidPostcode(postcode) || isValidOutcode(postcode), 
      "Enter a valid postcode (e.g. SW1 1AA) or outcode (e.g. SW1)"
    ),
  houseSize: z.coerce
    .string()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional()
    .refine((value) => value === undefined || (!isNaN(value) && value > 0), {
      message: "Enter a positive house size.",
    }),
  houseAge: z
    .number()
    .min(1, { message: "Enter a valid estimated build year." })
    .or(z.undefined())
    .refine((value) => value !== undefined, {
      message: "Enter an estimated build year."
    }),
  houseBedrooms: z.coerce
    .number({
      message: "Enter a valid number of bedrooms."
    })
    .positive("Enter a positive number.")
    .or(z.literal("").transform(() => { throw new Error("Enter the number of bedrooms."); })),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: `Enter a house type.`,
    }
  ),
  maintenanceLevel: maintenanceLevelSchema,
});

export type FormFrontend = z.infer<typeof formSchema>;
