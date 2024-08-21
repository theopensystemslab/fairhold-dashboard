import prisma from "./db";

const getBuildPriceByHouseType = async (houseType: string): Promise<number> => {
  try {
    const { priceMid: buildPrice } = await prisma.buildPrices.findFirstOrThrow({
      where: {
        houseType: { equals: houseType },
      },
      select: { priceMid: true },
    });

    // Cast to string as 'not: null' clause in Prisma query does not type narrow
    return buildPrice as number;
  } catch (error) {
    throw new Error(
      `Data error: Unable to get buildPrice for houseType ${houseType}`
    );
  }
};

export const buildPriceRepo = {
  getBuildPriceByHouseType,
};
