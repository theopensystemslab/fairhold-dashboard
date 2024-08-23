import prisma from "./db";

export type socialRentAdjustmentTypes = {
  year: string;
  inflation: string;
  additional: string;
  total: string;
}[];

const getSocialRentAdjustments = async (): Promise<socialRentAdjustmentTypes> => {
    try {
        const result = await prisma.socialRentAdjustments.findMany({
            select: {
                year: true,
                inflation: true,
                additional: true,
                total: true,
            }
        });

        const socialRentAdjustments: socialRentAdjustmentTypes = result.map(item => ({
            year: item.year || '',
            inflation: item.inflation?.toString() || '',
            additional: item.additional?.toString() || '',
            total: item.total?.toString() || '',
        }));

        return socialRentAdjustments;
        
    } catch (error) {
        throw new Error(`Data error: Unable to find socialRentAdjustments`);
    }
};

export const socialRentAdjustmentsRepo = {
    getSocialRentAdjustments,
};
