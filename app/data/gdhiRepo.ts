import prisma from "./db";

const getGDHIByITL3 = async (itl3: string): Promise<number> => {
  try {
    const { gdhi } = await prisma.gDHI.findFirstOrThrow({
      where: {
        AND: {
          itl3: { equals: itl3 },
        },
      },
      select: { gdhi: true },
    });
    console.log('Result:', gdhi); 
    return gdhi;
  } catch (error) {
    throw Error(`Data error: Unable to find gdhi for itl3 ${itl3}`);
  }
};

export const gdhiRepo = {
  getGDHIByITL3,
};

