import prisma from "./db";

const getGDHIByITL1 = async (itl1: string): Promise<number> => {
  try {
    const { gdhi } = await prisma.gDHI.findFirstOrThrow({
      where: {
        AND: {
          itl1: { equals: itl1 },
        },
      },
      select: { gdhi: true },
    });
    return gdhi;
  } catch (error) {
    throw Error(`Data error: Unable to find gdhi for itl1 ${itl1}`);
  }
};

export const gdhiRepo = {
  getGDHIByITL1,
};

