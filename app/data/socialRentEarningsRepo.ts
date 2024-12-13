import prisma from "./db";

const getSocialRentEarningsByITL3 = async (itl3: string): Promise<number> => {
    try {
        const result = await prisma.socialRentEarnings.aggregate({ 
            where: {
              itl3: {
                startsWith: itl3.substring(0, 3),
              },
            },
            _avg: {
              earningsPerWeek: true,
            },
          });
        
        const monthlyMeanRent = result._avg.earningsPerWeek;
        
        if (monthlyMeanRent === null) {
            throw new Error(`No data found for itl3 ${itl3}`);
        }
        
        return monthlyMeanRent;
        
    } catch (error) {
        throw Error(`Data error: Unable to find earningsPerWeek for itl3 ${itl3}`);
    }
};

export const socialRentEarningsRepo = {
    getSocialRentEarningsByITL3,
};