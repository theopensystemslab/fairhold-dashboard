import { gdhiRepo } from "../data/gdhiRepo";

const getByITL3 = async (itl3: string) => {
  return await gdhiRepo.getGDHI2020ByITL3(itl3);
};

export const gdhiService = {
  getByITL3,
};
