import prisma from "./db";

const getGDHI2020ByITL3 = async (itl3: string): Promise<number> => {
  try {
    const { gdhi_2020 } = await prisma.gdhi.findFirstOrThrow({
      where: {
        AND: {
          itl3: { equals: itl3 },
          // TODO: Add `NOT NULL` constraint to column
          gdhi_2020: { not: null },
        },
      },
      select: { gdhi_2020: true },
    });

    return gdhi_2020 as number;
  } catch (error) {
    throw Error(`Data error: Unable to find gdhi2020 for itl3 ${itl3}`);
  }
};

export const gdhiRepo = {
  getGDHI2020ByITL3,
};
