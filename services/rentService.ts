import { rentRepo } from "../data/rentRepo";

const getByITL3AndBedrooms = async (itl3: string, bedrooms: number) => {
  return await rentRepo.getRentByITL3AndBedrooms(itl3, bedrooms);
};

export const rentService = {
  getByITL3AndBedrooms,
};
