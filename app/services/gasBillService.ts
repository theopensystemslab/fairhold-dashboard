import { gasBillRepo } from "../data/gasBillRepo";

const getByITL3 = async (itl3: string) => {
  return await gasBillRepo.getGasBillByITL3(itl3);
};

export const gasBillService = {
  getByITL3,
};
