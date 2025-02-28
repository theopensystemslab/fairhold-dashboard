import { APIError } from "../lib/exceptions";
import prisma from "./db";

const MINIMUM_NUMBER_OF_POSTCODES = 30;

interface PricesPaidParams {
  averagePrice: number;
  numberOfTransactions: number;
  granularityPostcode: string;
}

const getPricesPaidByPostcodeAndHouseType = async (
  postcodeDistrict: string,
  postcodeArea: string,
  postcodeSector: string,
  houseType: string
): Promise<PricesPaidParams> => {
  try {
    const summary = await prisma.pricesPaidSummary.findFirst({
      where: {
        propertyType: houseType,
        postcode: {
          in: [postcodeSector, postcodeDistrict, postcodeArea],
        },
        transactionCount: {
          gte: MINIMUM_NUMBER_OF_POSTCODES,
        },
      },
      orderBy: {
        // Coincidentally 'sector' comes before 'district' comes before 'area'
        granularityLevel: "asc",
      },
    });

    if (!summary) {
    throw new APIError({
      status: 500,
      message: "Unable to find sufficient transaction data",
      code: "INSUFFICIENT_PRICES_PAID_DATA",
    });
    }

    return {
      averagePrice: summary.averagePrice,
      numberOfTransactions: summary.transactionCount,
      granularityPostcode: summary.postcode,
    };
  } catch (error) {
    throw new Error(
      `Data error: Unable to get pricesPaid for postcode district ${postcodeDistrict} and houseType ${houseType}`
    );
  }
};

export const pricesPaidRepo = {
  getPricesPaidByPostcodeAndHouseType,
};
