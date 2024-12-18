import prisma from "./db";

const getGasBillByITL3 = async (itl: string): Promise<number> => {
    try {
        const { kwhCostPence } = await prisma.gasBills.findFirstOrThrow({
            where: {
                itl1: { startsWith: itl.substring(0, 3) },
            },
            select: { kwhCostPence: true },
        });

        return kwhCostPence;
    } catch (error) {
        throw Error(`Data error: Unable to find gas_bills_2020 for itl3 ${itl}`);
    }
};

export const gasBillRepo = {
    getGasBillByITL3,
  };
  