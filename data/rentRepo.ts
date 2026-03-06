import prisma from "./db";
import { HouseType } from "../models/Property";

const HOUSE_TYPE_MAP: Record<HouseType, string> = {
  D: "rentDetached",
  S: "rentSemidetached",
  T: "rentTerraced",
  F: "rentFlatMaisonette",
};

const BEDROOM_MAP: Record<number, string> = {
  1: "rent1br",
  2: "rent2br",
  3: "rent3br",
  4: "rent4plusbr",
};

export interface RentData {
  averageRent: number;
  bedroomRent: number;
  houseTypeRent: number;
}

const getRentByITL3BedroomsAndType = async (
  itl3: string,
  houseType: HouseType,
  bedrooms: number
): Promise<RentData> => {
  try {
    const result = await prisma.rent.findFirst({
      where: { itl3 },
    });

    if (!result) {
      throw new Error(`No rent data found for itl3 ${itl3}`);
    }

    const houseTypeColumn = HOUSE_TYPE_MAP[houseType];
    const houseTypeRent = result[houseTypeColumn as keyof typeof result] as number;

    const bedsInRange = Math.min(Math.max(bedrooms, 1), 4);
    const bedroomColumn = BEDROOM_MAP[bedsInRange];
    const bedroomRent = result[bedroomColumn as keyof typeof result] as number;

    return {
      averageRent: result.averageRent,
      bedroomRent,
      houseTypeRent,
    };
  } catch (error) {
    throw new Error(
      `Data error: Unable to find rent for itl3 ${itl3}`
    );
  }
};

export const rentRepo = {
  getRentByITL3BedroomsAndType,
};