import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    const postcodeParts = data.housePostcode.split(/\s+/); // split the postcode based on the white space, for example SE17 1PE into SE17 and 1PE
    const postcodeLvl1 = postcodeParts[0].replace(/[^a-zA-Z]/g, ""); // extract only the characters of the first part, e.g SE
    const postcodeLvl2 = postcodeParts[0]; //  exctract the first part in total , e.g., SE17
    const postcodeLvl3 = postcodeParts[0] + " " + postcodeParts[1][0]; // extract the first part and add the secon, e.g., SE17 1

    // create the progressive queries
    const minimumNumberPostcodes = 30; // minimum number of entries to create the average
    let pricesPaid; // declare the variable for prices paid
    let numberOfTransactions; // declare the variable for numbers of transactions retrieved
    let granularityPostcode; // declare the granularity of the postcode

    const postdoceSearch3 = postcodeLvl3 + "%"; // add the % for SQL query
    const resLvl3 = await prisma.$queryRaw`
      SELECT id, postcode, price 
      FROM "public"."pricespaid" 
      WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch3}
    `; // execute query and extract results
    console.log("resLvl3: ", resLvl3);
    const numberOfPricesPaidLvl3 = resLvl3.length; // extract the number of entries

    if (
      numberOfPricesPaidLvl3 >= minimumNumberPostcodes
    ) {
      pricesPaid = pricesPaidLvl3; // if condtion is met, the granularity is appropriate
      numberOfTransactions = numberOfPricesPaidLvl3; // check the granularity
      granularityPostcode = postcodeLvl3; // granularity of the postcode
    } else {
      const postdoceSearch2 = postcodeLvl2 + "%"; // add the % for SQL query
      const resLvl2 = await prisma.$queryRaw`
        SELECT id, postcode, price 
        FROM "public"."pricespaid" 
        WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch2}
      `;      
      console.log("resLvl2: ", resLvl2);
      const numberOfPricesPaidLvl2 = resLvl2.length; // extract the number of entries

      if (
        numberOfPricesPaidLvl2 >= minimumNumberPostcodes
      ) {
        pricesPaid = resLvl2; // if condtion is met, the granularity is appropriate
        numberOfTransactions = numberOfPricesPaidLvl2; // check the granularity
        granularityPostcode = postcodeLvl2; // granularity of the postcode
      } else {
        const postdoceSearch1 = postcodeLvl1 + "%"; // add the % for SQL query
        const resLvl1 = await prisma.$queryRaw`
          SELECT id, postcode, price 
          FROM "public"."pricespaid" 
          WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch1}
        `;      
        console.log("resLvl1: ", resLvl1);  
        const numberOfPricesPaidLvl1 = resLvl1.length;
        pricesPaid = resLvl1;
        numberOfTransactions = numberOfPricesPaidLvl1;
        granularityPostcode = postcodeLvl1;
      }
    }

    // Calculate the total price
    const totalPrice = pricesPaid.reduce(
      (total: number, item: any) => total + item.price,
      0
    );
    console.log("totalPrice:", totalPrice)

    // Calculate the average price
    const averagePrice = totalPrice / pricesPaid.length;
    const buildPriceRes = await prisma.$queryRaw`
      SELECT * FROM "public"."buildprices" 
      WHERE "housetype" = ${data.houseType}
    `;
    console.log("buildPriceRes:", buildPriceRes);
    const buildPrice = buildPriceRes[0]['pricemid'];
    console.log("buildPrice:", buildPrice);

    // get the ITL3 value
    const itl3Res = await prisma.$queryRaw`
      SELECT "itl_lookup"::text AS "itl_lookup" 
      FROM "public"."itl_lookup"  
      WHERE "postcode" = ${postcodeParts[0]}
    `;
    const itlLookupValue = itl3Res[0].itl_lookup;
    const itlLookupParts = itlLookupValue.split(',');
    const itl3 = itlLookupParts[3]; // Extract the 3rd value (index 3)
    console.log("itl3: ", itl3);
    console.log("itl3Res: ", itl3Res);

    // get the gdhi value --> Note: this need to change to accommodate future data
    const gdhiRes = await prisma.$queryRaw`
      SELECT gdhi_2020 
      FROM "public"."gdhi" 
      WHERE "itl3" = ${itl3}
    `;
    const gdhi = gdhiRes[0]['gdhi_2020'];
    console.log("gdhiRes: ", gdhiRes)
    console.log("gdhi: ", gdhi)

    // get the rent value --> Note: this need to change to accommodate future data
    const rentRes = await prisma.$queryRaw`
      SELECT monthlymeanrent 
      FROM "public"."rent" 
      WHERE itl3 = ${itl3}
    `;
    console.log("rentRes: ", rentRes)
    let averageRent;
        if (rentRes.length === 1) {
          averageRent = rentRes[0].monthlymeanrent;
        } else if (rentRes.length > 1) {
          const totalRent = rentRes.reduce((sum, item) => sum + item.monthlymeanrent, 0);
          averageRent = totalRent / rentRes.length;
    console.log(averageRent);

    // get the rent adjustements --> Note: this need to change to accommodate future data
    const rentAdjustements = await prisma.$queryRaw`
      SELECT * 
      FROM "public"."soc_rent_adjustments"
    `;// execute the query and retrieve the results
    console.log("rentAdjustements: ", rentAdjustements);
    
    // get the rent value --> Note: this need to change to accommodate future data
    const socialRentEarningRes = await prisma.$queryRaw`
      SELECT earningsperweek 
      FROM "public"."socialrent" 
      WHERE SUBSTRING(itl3 FROM 1 FOR 4) = ${itl3.substring(0, 4)}
      `;
    console.log("socialRentEarningRes: ", socialRentEarningRes)
    let socialRentAveEarning;
        if (socialRentEarningRes.length === 1) {
          socialRentAveEarning = socialRentEarningRes[0].earningsperweek;
        } else if (socialRentEarningRes.length > 1) {
          const socialRentTotalEarning = socialRentAveEarning.reduce((sum, item) => sum + item.earningsperweek, 0);
          socialRentAveEarning = totalRent / socialRentEarningRes.length;
        }
    console.log("socialRentAveEarning: ", socialRentAveEarning);

    const averageSocialRent = 100 // PLACEHOLDER--NEED TO DO THE SOCIAL RENT FORMULA HERE
    console.log("averageSocialRent: ", averageSocialRent);

    // get the hpi value --> Note: this need to change to accommodate future data
    const hpiRes = await prisma.$queryRaw`
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
    console.log("averageHpi: ", averageHpi)
        
    return NextResponse.json({
      postcode: data.housePostcode,
      houseType: data.houseType,
      houseAge: parseFloat(data.houseAge),
      houseBedrooms: parseFloat(data.houseBedrooms),
      houseSize: parseFloat(data.houseSize),
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      itl3: itl3,
      gdhi: gdhi,
      hpi: averageHpi,
      buildPrice: buildPrice,
      averageRent: averageRent,
      averageSocialRent: averageSocialRent,
      numberOfTransactions: numberOfTransactions,
      granularityPostcode: granularityPostcode,
      pricesPaid: pricesPaid,
    }); 
  };
  
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
  };
};
