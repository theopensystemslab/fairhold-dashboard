import prisma from "./db";

const getSocialRentEarningsByITL3 = async (itl3: string): Promise<number> => {
    try {
        const { earningsPerWeek } = await prisma.socialRent.findFirstOrThrow({
            where: {
                itl3: { equals: itl3 },
            },
            select: { earningsPerWeek: true },
        });

        return earningsPerWeek as number;
    } catch (error) {
        throw Error(`Data error: Unable to find earningsPerWeek for itl3 ${itl3}`);
    }
};

export const socialRentEarningsRepo = {
    getSocialRentEarningsByITL3,
  };
  