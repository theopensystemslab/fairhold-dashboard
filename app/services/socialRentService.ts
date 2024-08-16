import { socialRentEarningsRepo } from "../data/socialRentEarningsRepo";

const getByITL3 = async (itl3: string) => {
  return await socialRentEarningsRepo.getSocialRentEarningsByITL3(itl3);
};

export const socialRentEarningsService = {
  getByITL3,
};
