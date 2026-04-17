import { rentRepo } from "../data/rentRepo";
import { HouseType } from "../models/Property";

const getByITL3BedroomsAndType = async (itl3: string, houseType: HouseType, bedrooms: number) => {
  return await rentRepo.getRentByITL3BedroomsAndType(itl3, houseType, bedrooms, );
};

export const rentService = {
  getByITL3BedroomsAndType,
};
