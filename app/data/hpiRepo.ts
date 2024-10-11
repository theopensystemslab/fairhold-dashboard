import prisma from "./db";

const getHPIByITL3 = async (itl3: string): Promise<number> => {
  try {
    const {
      _avg: { hpi2000: averageHpi },
    } = await prisma.hPI.aggregate({
      where: {
        itl3: {
          endsWith: itl3,
        },
      },
      _avg: {
        hpi2000: true,
      },
    });
    return averageHpi as number;
  } catch (error) {
    throw Error(`Data error: Unable to find hpi2000 for itl3 ${itl3}`);
  }
};

export const hpi2000Repo = {
  getHPIByITL3,
};
