import { rentRepo } from "../data/rentRepo";

const getByITL3 = async (itl3: string) => {
  return await rentRepo.getRentByITL3(itl3);
};

export const rentService = {
  getByITL3,
};
