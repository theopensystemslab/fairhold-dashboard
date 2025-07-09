import { hpi1999Repo } from "../data/hpiRepo";

const getByITL3 = async (itl3: string) => {
  return await hpi1999Repo.getHPIByITL3(itl3);
};

export const hpiService = {
  getByITL3,
};
