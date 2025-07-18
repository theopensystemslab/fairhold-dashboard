import { buildPriceRepo } from "../data/buildPriceRepo";

const getBuildPriceByHouseType = async (houseType: string) => {
  return await buildPriceRepo.getBuildPriceByHouseType(houseType);
};

export const buildPriceService = {
  getBuildPriceByHouseType,
};
