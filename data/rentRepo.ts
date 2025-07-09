import prisma from "./db";

const getRentByITL3AndBedrooms = async (itl3: string, bedrooms: number): Promise<number> => {
  try {
    const result = await prisma.rent.findMany({
      where: {
        itl3: itl3,
        bedrooms: bedrooms,
      }
    });

    if (result.length === 0 || result[0].monthlyMeanRent === null) {
      throw new Error(`No monthlyMeanRent found for itl3 ${itl3} and bedrooms ${bedrooms}`);
    }

    const total = result.reduce((sum, item) => sum + item.monthlyMeanRent, 0);
    const average = total / result.length;

    return average;
  } catch (error) {
    throw new Error(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  }
};

export const rentRepo = {
  getRentByITL3AndBedrooms,
};
