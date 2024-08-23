import prisma from "./db";

const getRentByITL3 = async (itl3: string): Promise<number | null> => {
    try {
        const result = await prisma.rent.aggregate({
            where: {
                itl3: { equals: itl3 },
            },
            _avg: {
                monthlyMeanRent: true,
            },
        });

        const monthlyMeanRent = result._avg.monthlyMeanRent;

        return monthlyMeanRent;
    } catch (error) {
        throw new Error(`Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`);
    }
};

export const rentRepo = {
    getRentByITL3,
};
