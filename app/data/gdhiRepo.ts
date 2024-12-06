import prisma from "./db";

const getGDHI2020ByITL3 = async (itl3: string): Promise<number> => {
  try {
    const { gdhi2020 } = await prisma.gDHI.findFirstOrThrow({
      where: {
        AND: {
          itl3: { equals: itl3 },
        },
      },
      select: { gdhi2020: true },
    });

    return gdhi2020;
  } catch (error) {
    throw Error(`Data error: Unable to find gdhi2020 for itl3 ${itl3}`);
  }
};

export const gdhiRepo = {
  getGDHI2020ByITL3,
};

