import prisma from "./db";

const getRentByITL3AndBedrooms = async (itl3: string, bedrooms: number): Promise<number> => {
  try {
    const result = await prisma.rent.aggregate({
      where: {
        itl3: { equals: itl3 },
        bedrooms: { equals: bedrooms }
      },
      _avg: {
        monthlyMeanRent: true,
      },
    });

    const monthlyMeanRent = result._avg.monthlyMeanRent;

    if (monthlyMeanRent === null) {
      throw new Error(`No monthlyMeanRent found for itl3 ${itl3}`);
    }

    return monthlyMeanRent;
  } catch (error) {
    throw new Error(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  }
};

export const rentRepo = {
  getRentByITL3AndBedrooms,
};
