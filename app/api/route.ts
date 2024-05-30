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
    const getPricesLvl3Query = `
      SELECT id, postcode, price 
      FROM "public"."pricespaid" 
      WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch3}
    `;
    const resLvl3 = await prisma.$queryRaw(getPricesLvl3Query); // execute query and extract results
    const pricesPaidLvl3 = resLvl3.rows;
    const numberOfPricesPaidLvl3 = pricesPaidLvl3.length; // extract the number of entries

    if (
      pricesPaidLvl3 !== null &&
      numberOfPricesPaidLvl3 >= minimumNumberPostcodes
    ) {
      pricesPaid = pricesPaidLvl3; // if condtion is met, the granularity is appropriate
      numberOfTransactions = numberOfPricesPaidLvl3; // check the granularity
      granularityPostcode = postcodeLvl3; // granularity of the postcode
    } else {
      const postdoceSearch2 = postcodeLvl2 + "%"; // add the % for SQL query
      const getPricesLvl2Query = `
        SELECT id, postcode, price 
        FROM "public"."pricespaid" 
        WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch2}
      `;      
      const resLvl2 = await prisma.$queryRaw(getPricesLvl2Query);
      const pricesPaidLvl2 = resLvl2.rows;
      const numberOfPricesPaidLvl2 = pricesPaidLvl2.length; // extract the number of entries

      if (
        pricesPaidLvl2 !== null &&
        numberOfPricesPaidLvl2 >= minimumNumberPostcodes
      ) {
        pricesPaid = pricesPaidLvl2; // if condtion is met, the granularity is appropriate
        numberOfTransactions = numberOfPricesPaidLvl2; // check the granularity
        granularityPostcode = postcodeLvl2; // granularity of the postcode
      } else {
        const postdoceSearch1 = postcodeLvl1 + "%"; // add the % for SQL query
        const getPricesLvl1Query = `
          SELECT id, postcode, price 
          FROM "public"."pricespaid" 
          WHERE propertyType = ${data.houseType} AND postcode LIKE ${postdoceSearch1}
        `;        
        const resLvl1 = await prisma.$queryRaw(getPricesLvl1Query);
        const pricesPaidLvl1 = resLvl1.rows;
        const numberOfPricesPaidLvl1 = pricesPaidLvl1.length;
        pricesPaid = pricesPaidLvl1;
        numberOfTransactions = numberOfPricesPaidLvl1;
        granularityPostcode = postcodeLvl1;
      }
    }

    // Calculate the total price
    const totalPrice = pricesPaid.reduce(
      (total: number, item: any) => total + item.price,
      0
    );

    // Calculate the average price
    const averagePrice = totalPrice / pricesPaid.length;
    const getBuildPriceQuery = `SELECT * FROM "public"."buildprices" WHERE "housetype" = ${data.houseType}`;
    const buildPriceRes = await prisma.$queryRaw(getBuildPriceQuery);
    const buildPrice = buildPriceRes.rows;

    // get the ITL3 value
    const getITL3Query = `SELECT itl3 FROM "public"."itl3" WHERE "postcode" = ${data.housePostcode}`;
    const itl3Res = await prisma.$queryRaw(getITL3Query);
    const itl3 = itl3Res.rows;

    // get the gdhi value --> Note: this need to change to accommodate future data
    const getGDHIQuery = `SELECT gdhi_2020 FROM "public"."gdhi" JOIN "public"."itl3" ON "public"."gdhi"."itl3" = "public"."itl3"."itl3" WHERE "postcode" = ${data.housePostcode}`;
    const gdhiRes = await prisma.$queryRaw(getGDHIQuery);
    const gdhi = gdhiRes.rows;

    // get the rent value --> Note: this need to change to accommodate future data
    const getRentQuery = `SELECT monthlyMeanRent FROM "public"."rent" JOIN "public"."itl3" ON "public"."rent"."itl3" = "public"."itl3"."itl3" WHERE postcode = ${data.housePostcode}`;
    const rentRes = await prisma.$queryRaw(getRentQuery);
    const rent = rentRes.rows;
    const totalRent = rent.reduce((total: number, item: any) => total + item.monthlyMeanRent, 0);
    const averageRent = totalRent / rent.length;

    // get the rent adjustements --> Note: this need to change to accommodate future data
    const getRentAdjustementQuery = `SELECT * FROM "public"."socialRentAdjustments"`;
    const rentAdjustements = await prisma.$queryRaw(getRentAdjustementQuery); // execute the query and retrieve the results

    // get the rent value --> Note: this need to change to accommodate future data
    const getSocialRentQuery = `SELECT earningsPerWeek FROM "public"."socialRent" JOIN "public"."itl3" ON "public"."socialRent"."itl3" = "public"."itl3"."itl3" WHERE postcode = ${data.housePostcode}`;
    const socialRentRes = await prisma.$queryRaw(getSocialRentQuery);
    const socialRent = socialRentRes.rows;
    const totalSocialRent = socialRent.reduce((total: number, item: any) => total + item.earningsPerWeek, 0);
    const averageSocialRent = totalSocialRent / socialRent.length;

    // get the hpi value --> Note: this need to change to accommodate future data
    const getHPIQuery = `SELECT hpi_2020 FROM "public"."hpi" JOIN "public"."itl3" ON "public"."hpi"."itl3" = "public"."itl3"."itl3" WHERE postcode = ${data.housePostcode}`;
    const hpiRes = await prisma.$queryRaw(getHPIQuery);
    const hpi = hpiRes.rows;
    const totalHpi = hpi.reduce((total: number, item: any) => total + item.hpi_2020, 0);
    const averageHpi = totalHpi / hpi.length;
        
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
