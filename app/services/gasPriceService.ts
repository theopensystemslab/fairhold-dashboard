import { gasPriceRepo } from "../data/gasPriceRepo";

const getByITL3 = async (itl3: string) => {
  return await gasPriceRepo.getGasPriceByITL3(itl3);
};

export const gasPriceService = {
  getByITL3,
};
