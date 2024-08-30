import prisma from "./db";

const MINIMUM_NUMBER_OF_POSTCODES = 30;

interface pricesPaidParams {
  averagePrice: number;
  numberOfTransactions: number;
  granularityPostcode: string;
}
const getPricesPaidByPostcodeAndHouseType = async (
  postcodeDistrict: string,
  postcodeArea: string,
  postcodeSector: string,
  houseType: string
): Promise<pricesPaidParams> => {
  try {
    // create the progressive queries
    let numberOfTransactions; // declare the variable for numbers of transactions retrieved
    let granularityPostcode; // declare the granularity of the postcode
    let averagePrice;

    const pricesPaidSector = await prisma.pricesPaid.aggregate({
      where: {
        propertyType: {
          equals: houseType,
        },
        postcode: {
          startsWith: postcodeSector,
        },
      },
      _count: {
        id: true,
      },
      _avg: {
        price: true,
      },
    });

    const numberPerSector = pricesPaidSector._count.id;
    const isMinMetBySector = numberPerSector >= MINIMUM_NUMBER_OF_POSTCODES;

    if (!isMinMetBySector) {
      const pricesPaidDistrict = await prisma.pricesPaid.aggregate({
        where: {
          propertyType: {
            equals: houseType,
          },
          postcode: {
            startsWith: postcodeDistrict,
          },
        },
        _count: {
          id: true,
        },
        _avg: {
          price: true,
        },
      });

      const numberPerDistrict = pricesPaidDistrict._count.id;
      const isMinMetByDistrict =
        numberPerDistrict >= MINIMUM_NUMBER_OF_POSTCODES;

      if (!isMinMetByDistrict) {
        const pricesPaidArea = await prisma.pricesPaid.aggregate({
          where: {
            propertyType: {
              equals: houseType,
            },
            postcode: {
              startsWith: postcodeArea,
            },
          },
          _count: {
            id: true,
          },
          _avg: {
            price: true,
          },
        });
        const numberPerArea = pricesPaidArea._count.id;
        numberOfTransactions = numberPerArea; // check the granularity
        granularityPostcode = postcodeArea; // granularity of the postcode when performing the average price search
        averagePrice = pricesPaidArea._avg.price;
      } else {
        numberOfTransactions = numberPerDistrict; // check the granularity
        granularityPostcode = postcodeDistrict; // granularity of the postcode
        averagePrice = pricesPaidDistrict._avg.price;
      }
    } else {
      numberOfTransactions = numberPerSector; // check the granularity
      granularityPostcode = postcodeSector; // granularity of the postcode
      averagePrice = pricesPaidSector._avg.price;
    }

    if (averagePrice === null) {
      throw new Error("Unable to calculate average price");
    }

    // Cast to string as 'not: null' clause in Prisma query does not type narrow
    return {
      averagePrice,
      numberOfTransactions,
      granularityPostcode,
    } as pricesPaidParams;
  } catch (error) {
    throw new Error(
      `Data error: Unable to get pricesPaid for postcode district ${postcodeDistrict} and houseType ${houseType}`
    );
  }
};

export const pricesPaidRepo = {
  getPricesPaidByPostcodeAndHouseType,
};
