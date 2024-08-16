import prisma from "./db";

const getHPIByITL3 = async (itl3: string): Promise<number> => {
    try {
        const { hpi2020 } = await prisma.hPI.findFirstOrThrow({
            where: {
                itl3: { equals: itl3 },
            },
            select: { hpi2020: true },
        });

        return hpi2020 as number;
    } catch (error) {
        throw Error(`Data error: Unable to find hpi2020 for itl3 ${itl3}`);
    }
};

export const hpi2020Repo = {
    getHPIByITL3,
  };
  