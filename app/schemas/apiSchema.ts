import { z } from "zod";
import { parse as parsePostcode } from "postcode";
import { HOUSE_TYPES } from "../models/Property";
import { MAINTENANCE_LEVELS } from "../models/constants";

// Type not exported by postcode lib directly
export type ValidPostcode = Extract<
  ReturnType<typeof parsePostcode>,
  { valid: true }
>;

const HouseTypeEnum = z.enum(HOUSE_TYPES);
const MaintenanceEnum = z.enum(MAINTENANCE_LEVELS);

export const apiSchema = z.object({
  housePostcode: z.custom<ValidPostcode>(),
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
  maintenanceSpend: MaintenanceEnum.refine(
    (value) => MaintenanceEnum.options.includes(value),
    {
      message: `maintenanceSpend is required and must be one of ${MAINTENANCE_LEVELS}`,
    }
  ),
});

export type api = z.infer<typeof apiSchema>;
