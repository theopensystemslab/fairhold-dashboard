import * as repo from './../data/gdhiRepo';

export const getByITL3 = async (itl3: string) => {
  return await repo.getGDHI2020ByITL3(itl3);
};
