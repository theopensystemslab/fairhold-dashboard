import prisma from "./db";

const getHPIByITL3 = async (itl3: string): Promise<number> => {
  try {
    const {
      _avg: { hpi1999: averageHpi },
    } = await prisma.hPI.aggregate({
      // TODO: Should there be a relationship on ITL3?
      where: {
        itl3: {
          endsWith: itl3,
        },
      },
      _avg: {
        hpi1999: true,
      },
    });

    // Check if the average HPI is null and throw an error
    if (averageHpi === null) {
      throw new Error(`Data error: Unable to find hpi1999 for itl3 ${itl3}`);
    }

    return averageHpi;
  } catch (error) {
    throw Error(`Data error: Unable to find hpi1999 for itl3 ${itl3}`);
  }
};

export const hpi1999Repo = {
  getHPIByITL3,
};
