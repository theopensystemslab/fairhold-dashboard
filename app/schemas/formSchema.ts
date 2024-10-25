import { z } from "zod";
import { parse as parsePostcode, fix as fixPostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";

const HouseTypeEnum = z.enum(HOUSE_TYPES);

/**
 * Describes the form the user will interact with in the frontend
 */
export const formSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "housePostcode is required")
    .refine(fixPostcode, "Invalid postcode"),
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
});

export type formType = z.infer<typeof formSchema>;
