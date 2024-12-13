import prisma from "./db";

const getGasBillByITL3 = async (itl: string): Promise<number> => {
    try {
        const { kwh_cost_pence } = await prisma.gasBills.findFirstOrThrow({
            where: {
                itl1: { startsWith: itl.substring(0, 3) },
            },
            select: { kwh_cost_pence: true },
        });

        return kwh_cost_pence;
    } catch (error) {
        throw Error(`Data error: Unable to find gas_bills_2020 for itl3 ${itl}`);
    }
};

export const gasBillRepo = {
    getGasBillByITL3,
  };
  