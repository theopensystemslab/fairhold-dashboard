import { z } from "zod";
import { parse as parsePostcode, fix as fixPostcode } from "postcode";

const HouseTypeEnum = z.enum(['D', 'S', 'T', 'F']);

/**
 * Describes the form the user will interact with in the frontend
 */
export const calculationSchema = z.object({
  housePostcode: z
    .string()
    .min(1, "housePostcode is required")
    .refine(fixPostcode, "Invalid postcode")
    .transform(parsePostcode)
    .refine((postcode) => postcode.valid),
  houseSize: z.coerce.number().positive("houseSize must be a positive integer"),
  houseAge: z.coerce.number().positive("houseAge must be a positive integer"),
  houseBedrooms: z.coerce
    .number()
    .positive("houseBedroomsmust be a positive integer"),
  houseType: HouseTypeEnum.refine(
    (value) => HouseTypeEnum.options.includes(value),
    {
      message: "houseType is required and must be one of 'D', 'S', 'T', 'F'",
    }
  ),
});

export type Calculation = z.infer<typeof calculationSchema>;
