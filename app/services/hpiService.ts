import { hpi2000Repo } from "../data/hpiRepo";

const getByITL3 = async (itl3: string) => {
  return await hpi2000Repo.getHPIByITL3(itl3);
};

export const hpiService = {
  getByITL3,
};
