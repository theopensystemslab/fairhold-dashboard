import { PrismaClient } from "@prisma/client";
import { itlService } from "./itlService";
import { gdhiService } from "./gdhiService";
import { Calculation } from "../schemas/calculationSchema";

const prisma = new PrismaClient();

export const getHouseholdData = async (
  input: Calculation
) => {
  try {
    // data are going to be queried at different levels of granularity based on the postcode
    const postcode = input.housePostcode;
    const postcodeArea = postcode.area; // extract only the characters for the area, e.g SE
    const postcodeDistrict = postcode.district; // extract only characters for the district, SE17
    const postcodeSector = postcode.sector; // extract only the characters for the sector, SE17 1

    // create the progressive queries
    const minimumNumberPostcodes = 30; // minimum number of entries to create the average
    let pricesPaid; // declare the variable for prices paid
    let numberOfTransactions; // declare the variable for numbers of transactions retrieved
    let granularityPostcode; // declare the granularity of the postcode
    let averagePrice;

    const pricesPaidSector = await prisma.pricesPaid.aggregate({
      where: {
        propertyType: {
          equals: input.houseType,
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
    const isMinMetBySector = numberPerSector >= minimumNumberPostcodes;

    if (!isMinMetBySector) {
      const pricesPaidDistrict = await prisma.pricesPaid.aggregate({
        where: {
          propertyType: {
            equals: input.houseType,
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
      const isMinMetByDistrict = numberPerDistrict >= minimumNumberPostcodes;

      if (!isMinMetByDistrict) {
        const pricesPaidArea = await prisma.pricesPaid.aggregate({
          where: {
            propertyType: {
              equals: input.houseType,
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

        pricesPaid = pricesPaidArea; // if condition is met, the granularity is appropriate
        numberOfTransactions = numberPerArea; // check the granularity
        granularityPostcode = postcodeArea; // granularity of the postcode when performing the average price search
        averagePrice = pricesPaidArea._avg.price;
      } else {
        pricesPaid = pricesPaidDistrict; // if condition is met, the granularity is appropriate
        numberOfTransactions = numberPerDistrict; // check the granularity
        granularityPostcode = postcodeDistrict; // granularity of the postcode
        averagePrice = pricesPaidDistrict._avg.price;
      }
    } else {
      pricesPaid = pricesPaidSector; // if condition is met, the granularity is appropriate
      numberOfTransactions = numberPerSector; // check the granularity
      granularityPostcode = postcodeSector; // granularity of the postcode
      averagePrice = pricesPaidSector._avg.price;
    }

    if (averagePrice === null) {
      throw new Error("Unable to calculate average price");
    }

    const { priceMid: buildPrice } = await prisma.buildPrices.findFirstOrThrow({
      where: {
        houseType: { equals: input.houseType },
      },
      select: { priceMid: true },
    });
    // TODO: Make columns non-nullable
    if (!buildPrice) throw Error("Missing buildPrice");

    const itl3 = await itlService.getByPostcodeDistrict(postcodeDistrict);
    const gdhi = await gdhiService.getByITL3(itl3);

    const {
      _avg: { monthlyMeanRent: averageRentMonthly },
    } = await prisma.rent.aggregate({
      where: { itl3 },
      _avg: {
        monthlyMeanRent: true,
      },
    });
    if (!averageRentMonthly) throw Error("Missing averageRentMonthly");

    const socialRentAdjustments = await prisma.socialRentAdjustments.findMany();
    const itl3Prefix = itl3.substring(0, 4);

    const {
      _avg: { earningsPerWeek: socialRentAveEarning },
    } = await prisma.socialRent.aggregate({
      where: {
        itl3: {
          startsWith: itl3Prefix,
        },
      },
      _avg: {
        earningsPerWeek: true,
      },
    });

    if (!socialRentAveEarning) throw Error("Missing socialRentAveEarning");

    const {
      _avg: { hpi2020: averageHpi },
    } = await prisma.hPI.aggregate({
      where: {
        itl3: {
          endsWith: itl3,
        },
      },
      _avg: {
        hpi2020: true,
      },
    });
    if (!averageHpi) throw Error("Missing averageHpi");

    const { bill: gasBillYearly } = await prisma.gasBills.findFirstOrThrow({
      where: {
        itl: {
          startsWith: itl3.substring(0, 3),
        },
      },
      select: {
        bill: true,
      },
    });
    if (!gasBillYearly) throw Error("Missing gasBillYearly");

    return {
      postcode: input.housePostcode,
      houseType: input.houseType,
      houseAge: input.houseAge,
      houseBedrooms: input.houseBedrooms,
      houseSize: input.houseSize,
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      itl3,
      gdhi,
      hpi: averageHpi,
      buildPrice,
      averageRentMonthly,
      socialRentAdjustments,
      socialRentAveEarning,
      numberOfTransactions,
      granularityPostcode,
      pricesPaid,
      gasBillYearly,
    }
  } catch (err) {
    throw Error(
      `Service error: Unable to generate household. Message: ${(err as Error).message}`
    );
  } finally {
    await prisma.$disconnect();
  }
};