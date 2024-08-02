import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Calculation, calculationSchema } from "../schemas/calculationSchema";

const prisma = new PrismaClient();

// define and export the GET handler function
export async function POST(req: Request) {
  try {
    // Parse and validate user input
    const data = await req.json()
    const input: Calculation = calculationSchema.parse(data);

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
          equals: data.houseType as string,
        },
        postcode: {
          startsWith: postcodeSector,
        },
      },
      _count: {
        id: true
      },
      _avg: {
        price: true,
      },
    });

    console.log({ pricesPaidSector });

    const numberPerSector = pricesPaidSector._count.id;
    const isMinMetBySector = numberPerSector >= minimumNumberPostcodes;

    if (!isMinMetBySector) {
      const pricesPaidDistrict = await prisma.pricesPaid.aggregate({
        where: {
          propertyType: {
            equals: data.houseType as string,
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

      console.log({ pricesPaidDistrict });

      if (!isMinMetByDistrict) {
        const pricesPaidArea = await prisma.pricesPaid.aggregate({
          where: {
            propertyType: {
              equals: data.houseType as string,
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
        console.log({ pricesPaidArea });

        const numberPerArea = pricesPaidArea._count.id;

        pricesPaid = pricesPaidArea; // if condition is met, the granularity is appropriate
        numberOfTransactions = numberPerArea; // check the granularity
        granularityPostcode = postcodeArea; // granularity of the postcode when performing the average price search
        averagePrice = pricesPaidArea._avg.price
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
    console.log({ pricesPaid });

    if (averagePrice === null) {
      throw new Error("Unable to calculate average price");
    }

    const buildPrice = await prisma.buildPrices.findFirst({
      where: {
        houseType: { equals: data.houseType as string },
      },
      select: { priceMid: true },
    });

    const itlLookup = await prisma.itlLookup.findFirstOrThrow({
      where: {
        postcode: postcodeDistrict,
        itl3: {
          not: null,
        },
      },
      select: {
        itl3: true,
      },
    });
    
    // Casting required as prisma does not type narrow with above clause "not: null"
    const itl3 = (itlLookup.itl3 as string)[3]; // Extract the 3rd value (index 3)
    console.log("itl3: ", itl3);

    const gdhi = await prisma.gDHI.findFirst({
      where: {
        itl3: { equals: itl3 },
      },
      select: { gdhi2020: true },
    });

    const averageRent = await prisma.rent.aggregate({
      where: { itl3 },
      _avg: {
        monthlyMeanRent: true,
      },
    });

    console.log({ averageRent });

    const socialRentAdjustments = await prisma.socialRentAdjustments.findMany();
    const itl3Prefix = itl3.substring(0, 4);

    const socialRentAveEarning = await prisma.socialRent.aggregate({
      where: {
        itl3: {
          startsWith: itl3Prefix
        }
      },
      _avg: {
        earningsPerWeek: true,
      },
    });
    console.log({ socialRentAveEarning });

    const averageHpi = await prisma.hPI.aggregate({
      where: {
        itl3: {
          endsWith: itl3
        },
      },
        _avg: {
          hpi2020: true
        }
      }
    );
    console.log({ averageHpi });

    const gasBillYearly = await prisma.gasBills.findFirstOrThrow({
      where: {
        itl: {
          startsWith: itl3.substring(0, 3)
        },
      },
      select: {
        bill: true
      }
    })
    console.log({ gasBillYearly });

    return NextResponse.json({
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
      socialRentAdjustments,
      numberOfTransactions,
      granularityPostcode,
      pricesPaid,
      gasBillYearly,
    });
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);
    const response = { error: (err as Error).message };
    return NextResponse.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
