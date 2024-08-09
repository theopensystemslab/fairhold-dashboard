import prisma from "./db";

const getBuildPriceByHouseType = async (houseType: string): Promise<number> => {
  try {
    const { pricemid: buildPrice } = await prisma.buildprices.findFirstOrThrow({
      where: {
        housetype: { equals: houseType },
      },
      select: { pricemid: true },
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
