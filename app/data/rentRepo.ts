import prisma from "./db";

const getRentByITL3 = async (itl3: string): Promise<number> => {
    try {
        const { monthlyMeanRent } = await prisma.rent.findFirstOrThrow({
            where: {
                itl3: { equals: itl3 },
            },
            select: { monthlyMeanRent: true },
        });

        return monthlyMeanRent as number;
    } catch (error) {
        throw Error(`Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`);
    }
};

export const rentRepo = {
    getRentByITL3,
  };
  