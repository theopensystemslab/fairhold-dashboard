import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// import the postcode library
import { parse, fix } from "postcode";

// define and export the GET handler function
export async function POST(request: Request) {
  const formData = await request.formData(); // get the data submitted in the form

  const data = {
    housePostcode: formData.get("housePostcode"), // get the housePostcode variable
    houseSize: formData.get("houseSize"), // get the houseSize variable
    houseAge: formData.get("houseAge"), // get the houseAge variable
    houseBedrooms: formData.get("houseBedrooms"), // get the houseBedrooms variable
    houseType: formData.get("houseType"), // get the houseType variable
  };

  try {
    // data are going to be queried at different levels of granularity based on the postcode
    if (!data.housePostcode) throw Error("Invalid postcode");
    const postcode = parse(fix(data.housePostcode.toString())); // define the postcode object. fix any issues with spacing

    if (!postcode.valid) throw Error("Invalid postcode");
    const postcodeArea = postcode.area; // extract only the characters for the area, e.g SE
    const postcodeDistrict = postcode.district; // extract only characters for the district, SE17
    const postcodeSector = postcode.sector; // extract only the characters for the sector, SE17 1

    // create the progressive queries
    const minimumNumberPostcodes = 30; // minimum number of entries to create the average
    let pricesPaid; // declare the variable for prices paid
    let numberOfTransactions; // declare the variable for numbers of transactions retrieved
    let granularityPostcode; // declare the granularity of the postcode

    const postcodeSearchSector = postcodeSector + "%"; // add the % for SQL query

    // define a type for PricePaid so that it is treated as an array
    type PricePaid = {
      id: number;
      postcode: string;
      price: number;
    };

    const pricesPaidSector = await prisma.$queryRaw<PricePaid[]>`
      SELECT id, postcode, price 
      FROM "public"."pricespaid" 
      WHERE propertyType = ${data.houseType} AND postcode LIKE ${postcodeSearchSector}
    `; // execute query and extract results
    console.log(
      "pricesPaidSector: ",
      pricesPaidSector,
      "postcodeSearchSector: ",
      postcodeSearchSector
    );
    const numberOfpricesPaidSector = Array.isArray(pricesPaidSector)
      ? pricesPaidSector.length
      : 0; // extract the number of entries

    if (
      pricesPaidSector == null ||
      numberOfpricesPaidSector <= minimumNumberPostcodes
    ) {
      const postcodeSearchDistrict = postcodeDistrict + "%"; // add the % for SQL query
      const pricesPaidDistrict = await prisma.$queryRaw<PricePaid[]>`
        SELECT id,postcode,price 
        FROM "public"."pricespaid" 
        WHERE propertyType = ${data.houseType} AND postcode LIKE ${postcodeSearchDistrict}
      `; // create the sql query and count how many items meet the criteria; execute the query and retrieve the results
      console.log(
        "pricesPaidDistrict: ",
        pricesPaidDistrict,
        "postcodeSearchDistrict: ",
        postcodeSearchDistrict
      );
      const numberOfpricesPaidDistrict = Array.isArray(pricesPaidDistrict)
        ? pricesPaidDistrict.length
        : 0; // extract the number of entries
      if (
        pricesPaidDistrict == null ||
        numberOfpricesPaidDistrict <= minimumNumberPostcodes
      ) {
        const postcodeSearchArea = postcodeArea + "%"; // add the % for SQL query
        const pricesPaidArea = await prisma.$queryRaw<PricePaid[]>`
          SELECT id,postcode,price 
          FROM "public"."pricespaid" 
          WHERE propertytype = ${data.houseType} AND postcode LIKE ${postcodeSearchArea}
        `; // create the sql query and count how many items meet the criteria; execute the query and retrieve the results
        console.log(
          "pricesPaidArea: ",
          pricesPaidArea,
          "postcodeSearchArea: ",
          postcodeSearchArea
        );

        const numberOfpricesPaidArea = Array.isArray(pricesPaidArea)
          ? pricesPaidArea.length
          : 0; // extract the number of entries
        pricesPaid = pricesPaidArea; // if condtion is met, the granularity is appropriate
        numberOfTransactions = numberOfpricesPaidArea; // check the granularity
        granularityPostcode = postcodeArea; // granularity of the postcode when performing the average price search
      } else {
        pricesPaid = pricesPaidDistrict; // if condtion is met, the granularity is appropriate
        numberOfTransactions = numberOfpricesPaidDistrict; // check the granularity
        granularityPostcode = postcodeDistrict; // granularity of the postcode}
      }
    } else {
      pricesPaid = pricesPaidSector; // if condtion is met, the granularity is appropriate
      numberOfTransactions = numberOfpricesPaidSector; // check the granularity
      granularityPostcode = postcodeSector; // granularity of the postcode}
    }
    console.log("pricesPaid: ", pricesPaid);

    // Calculate the total price    if (!pricesPaid) throw Error("Prices fetching failed");
    const totalPrice = pricesPaid.reduce(
      (total: number, item: any) => total + item.price,
      0
    );
    console.log("totalPrice:", totalPrice);

    // Calculate the average price
    const averagePrice = totalPrice / pricesPaid.length;

    // create type for buildPrice query
    type BuildPrice = {
      id: number;
      housetype: string;
      pricemid: number;
    };

    const buildPriceRes = await prisma.$queryRaw<BuildPrice[]>`
      SELECT * FROM "public"."buildprices" 
      WHERE "housetype" = ${data.houseType}
    `;
    console.log("buildPriceRes:", buildPriceRes);
    const buildPrice = buildPriceRes[0]["pricemid"];
    console.log("buildPrice:", buildPrice);

    // get the ITL3 value
    // create type for itl3Res query
    type ItlLookup = {
      itl_lookup: string;
    };

    const itl3Res = await prisma.$queryRaw<ItlLookup[]>`
      SELECT "itl_lookup"::text AS "itl_lookup" 
      FROM "public"."itl_lookup"  
      WHERE "postcode" = ${postcodeDistrict}
    `;
    const itlLookupValue = itl3Res[0].itl_lookup;
    const itlLookupParts = itlLookupValue.split(",");
    const itl3 = itlLookupParts[3]; // Extract the 3rd value (index 3)
    console.log("itl3: ", itl3);
    console.log("itl3Res: ", itl3Res);

    // create type for itl3Res query
    type gdhiRes = {
      gdhi_2020: number;
    };

    // get the gdhi value --> Note: this need to change to accommodate future data
    const gdhiRes = await prisma.$queryRaw<gdhiRes[]>`
      SELECT gdhi_2020 
      FROM "public"."gdhi" 
      WHERE "itl3" = ${itl3}
    `;
    const gdhi = gdhiRes[0]["gdhi_2020"];
    console.log("gdhiRes: ", gdhiRes);
    console.log("gdhi: ", gdhi);

    // create type for itl3Res query
    type rentRes = {
      monthlymeanrent: number;
    };

    // get the rent value --> Note: this need to change to accommodate future data
    const rentRes = await prisma.$queryRaw<rentRes[]>`
      SELECT monthlymeanrent 
      FROM "public"."rent" 
      WHERE itl3 = ${itl3}
    `;
    console.log("rentRes: ", rentRes);
    let averageRent;
    if (rentRes.length === 1) {
      averageRent = rentRes[0].monthlymeanrent;
    } else if (rentRes.length > 1) {
      const totalRent = rentRes.reduce(
        (sum, item) => sum + item.monthlymeanrent,
        0
      );
      averageRent = totalRent / rentRes.length;
      console.log(averageRent);

      // create type for rentAdjustment query
      type rentAdjustment = {
        year: string;
        inflation: string;
        additional: string;
        total: string;
      };

      // get the rent adjustements --> Note: this need to change to accommodate future data


      const socialRentAdjustments = await prisma.$queryRaw<rentAdjustment[]>`
      SELECT * 
      FROM "public"."soc_rent_adjustments"
    `; // execute the query and retrieve the results
      console.log("socialRentAdjustments[0]: ", socialRentAdjustments[0]);

      // create type for socialRentEarningRes query
      type socialRentEarningRes = {
        earningsperweek: number;
      };

      // get the rent value --> Note: this need to change to accommodate future data
      const socialRentEarningRes = await prisma.$queryRaw<
        socialRentEarningRes[]
      >`
      SELECT earningsperweek 
      FROM "public"."socialrent" 
      WHERE SUBSTRING(itl3 FROM 1 FOR 4) = ${itl3.substring(0, 4)}
      `;

      console.log("socialRentEarningRes: ", socialRentEarningRes);
      let socialRentAveEarning;
      if (socialRentEarningRes.length === 1) {
        socialRentAveEarning = socialRentEarningRes[0].earningsperweek;
      } else if (socialRentEarningRes.length > 1) {
        const socialRentTotalEarning = socialRentEarningRes.reduce(
          (sum, item) => sum + item.earningsperweek,
          0
        );
        socialRentAveEarning = totalRent / socialRentEarningRes.length;
      }
      console.log("socialRentAveEarning: ", socialRentAveEarning);

      // create type for hpiRes query
      type hpiRes = {
        hpi_2020: number;
      };

      // get the hpi value --> Note: this need to change to accommodate future data
      const hpiRes = await prisma.$queryRaw<hpiRes[]>`
      SELECT hpi_2020 FROM "public"."hpi" 
      WHERE itl3 = ${itl3}
    `;
      console.log("hpiRes: ", hpiRes);
      let averageHpi;
      if (hpiRes.length === 1) {
        averageHpi = hpiRes[0].hpi_2020;
      } else {
        const hpiTotal = hpiRes.reduce((sum, item) => sum + item.hpi_2020, 0);
        averageHpi = hpiTotal / hpiRes.length;
      }
      console.log("averageHpi: ", averageHpi);

      return NextResponse.json({
        postcode: postcode,
        houseType: data.houseType,
        houseAge: data.houseAge ? parseFloat(data.houseAge.toString()) : null,
        houseBedrooms: data.houseBedrooms
          ? parseFloat(data.houseBedrooms.toString())
          : null,
        houseSize: data.houseSize
          ? parseFloat(data.houseSize.toString())
          : null,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        itl3: itl3,
        gdhi: gdhi,
        hpi: averageHpi,
        buildPrice: buildPrice,
        averageRent: averageRent,
        socialRentAdjustments: socialRentAdjustments,
        socialRentAveEarning: socialRentAveEarning,
        numberOfTransactions: numberOfTransactions,
        granularityPostcode: granularityPostcode,
        pricesPaid: pricesPaid,
      });
    }

    // return the results
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}
