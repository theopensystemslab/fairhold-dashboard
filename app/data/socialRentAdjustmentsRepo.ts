import prisma from "./db";

export type socialRentAdjustmentTypes = {
  year: string;
  inflation: number;
  additional: number;
  total: number;
}[];

const getSocialRentAdjustments =
  async (): Promise<socialRentAdjustmentTypes> => {
    try {
      const result = await prisma.socialRentAdjustments.findMany({
        select: {
          year: true,
          inflation: true,
          additional: true,
          total: true,
        },
      });

      const socialRentAdjustments: socialRentAdjustmentTypes = result.map(
        (item) => {
          if (
            item.year === null ||
            item.inflation === null ||
            item.additional === null ||
            item.total === null
          ) {
            throw new Error(
              `Data error: Found null values in socialRentAdjustments`
            );
          }
          return {
            year: item.year,
            inflation: item.inflation,
            additional: item.additional,
            total: item.total,
          };
        }
      );

      // Return the array after validation
      return socialRentAdjustments;
    } catch (error) {
      throw new Error(`Data error: unable to find socialRentAdjustments`);
    }
  };

export const socialRentAdjustmentsRepo = {
  getSocialRentAdjustments,
};
