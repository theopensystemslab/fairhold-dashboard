import { gdhiRepo } from "../data/gdhiRepo";

const getByITL1 = async (itl1: string) => {
  return await gdhiRepo.getGDHIByITL1(itl1);
};

export const gdhiService = {
  getByITL1,
};
