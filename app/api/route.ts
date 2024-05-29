// import the Request and Response classes
import { NextResponse, NextRequest } from "next/server";

// import mysql2/promise for mysql connectivity
import mysql, { RowDataPacket } from "mysql2/promise";

// import GetDBSettings to retrieve the database connection environment parameters, and the IDBSettings object interface
import { GetDBSettings, IDBSettings } from "@/sharedCode/common";
const connectionParams = GetDBSettings();

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
    const connection = await mysql.createConnection(connectionParams); // create the connection to the database

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
    const getPricesSectorQuery = `SELECT id,postcode,price FROM fairhold.pricesPaid WHERE propertyType = '${data.houseType}' AND postcode LIKE '${postcodeSearchSector}'`; // create the sql query and count how many items meet the criteria
    const [pricesPaidSector] = await connection.execute<RowDataPacket[]>(
      getPricesSectorQuery
    ); // execute the query and retrieve the results
    const numberOfpricesPaidSector = Object.keys(pricesPaidSector).length; // extract the number of entries

    if (
      pricesPaidSector == null ||
      numberOfpricesPaidSector <= minimumNumberPostcodes
    ) {
      const postdoceSearchDistrict = postcodeDistrict + "%"; // add the % for SQL query
      const getPricesDistrictQuery = `SELECT id,postcode,price FROM fairhold.pricesPaid WHERE propertyType = '${data.houseType}' AND postcode LIKE '${postdoceSearchDistrict}'`; // create the sql query and count how many items meet the criteria
      const [pricesPaidDistrict] = await connection.execute<RowDataPacket[]>(
        getPricesDistrictQuery
      ); // execute the query and retrieve the results
      const numberOfpricesPaidDistrict = Object.keys(pricesPaidDistrict).length; // extract the number of entries
      if (
        pricesPaidDistrict == null ||
        numberOfpricesPaidDistrict <= minimumNumberPostcodes
      ) {
        const postdoceSearchArea = postcodeArea + "%"; // add the % for SQL query
        const getPricesAreaQuery = `SELECT id,postcode,price FROM fairhold.pricesPaid WHERE propertyType = '${data.houseType}' AND postcode LIKE '${postdoceSearchArea}'`; // create the sql query and count how many items meet the criteria
        const [pricesPaidArea] = await connection.execute<RowDataPacket[]>(
          getPricesAreaQuery
        ); // execute the query and retrieve the results
        const numberOfpricesPaidArea = Object.keys(pricesPaidArea).length; // extract the number of entries
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

    // Calculate the total price
    if (!pricesPaid) throw Error("Prices fetching failed");
    const totalPrice = pricesPaid.reduce(
      (total: number, item: any) => total + item.price,
      0
    );

    // Calculate the average price
    const averagePrice = totalPrice / pricesPaid.length;
    const getBuildPriceQuery = `SELECT * FROM fairhold.buildPrices WHERE houseType = '${data.houseType}'`; // create the sql query
    const [buildPrice] = await connection.execute<RowDataPacket[]>(
      getBuildPriceQuery
    ); // execute the query and retrieve the results

    // get the ITL3 value
    const getITL3Query = `SELECT itl3 FROM fairhold.itl3 WHERE postcode = '${postcode.postcode}'`; // create the sql query
    const [itl3] = await connection.execute<RowDataPacket[]>(getITL3Query); // execute the query and retrieve the results

    // get the gdhi value --> Note: this need to change to accommodate future data
    const getGDHIQuery = `SELECT gdhi_2020 FROM fairhold.gdhi JOIN fairhold.itl3 ON fairhold.gdhi.itl3 = fairhold.itl3.itl3 WHERE postcode = '${postcode.postcode}'`; // create the sql query
    const [gdhi] = await connection.execute<RowDataPacket[]>(getGDHIQuery); // execute the query and retrieve the results

    // get the rent value --> Note: this need to change to accommodate future data
    const getRentQuery = `SELECT monthlyMeanRent FROM fairhold.rent JOIN fairhold.itl3 ON fairhold.rent.itl3 = fairhold.itl3.itl3 WHERE postcode = '${postcode.postcode}'`; // create the sql query
    const [rent] = await connection.execute<RowDataPacket[]>(getRentQuery); // execute the query and retrieve the results
    const totalRent = rent.reduce(
      (total: number, item: any) => total + item.monthlyMeanRent,
      0
    );
    const averageRent = totalRent / rent.length;

    // get the rent adjustements --> Note: this need to change to accommodate future data
    const getRentAdjustementQuery = `SELECT * FROM fairhold.socialRentAdjustments`; // create the sql query
    const [rentAdjustements] = await connection.execute<RowDataPacket[]>(
      getRentAdjustementQuery
    ); // execute the query and retrieve the results

    // get the rent value --> Note: this need to change to accommodate future data
    const getSocialRentQuery = `SELECT earningsPerWeek FROM fairhold.socialRent JOIN fairhold.itl3 ON fairhold.itl3.itl3 LIKE CONCAT(fairhold.socialRent.itl3,'%') WHERE postcode ='${postcode.postcode}'`; // create the sql query
    const [Socialrent] = await connection.execute<RowDataPacket[]>(
      getSocialRentQuery
    ); // execute the query and retrieve the results
    const totalSocialRent = rent.reduce(
      (total: number, item: any) => total + item.earningsPerWeek,
      0
    );
    const averageSocialRent = totalSocialRent / Socialrent.length;

    // get the hpi value --> Note: this need to change to accommodate future data
    const getHPIQuery = `SELECT hpi_2020 FROM fairhold.hpi JOIN fairhold.itl3 ON fairhold.hpi.itl3 = fairhold.itl3.itl3 WHERE postcode = '${postcode.postcode}'`; // create the sql query
    const [hpi] = await connection.execute<RowDataPacket[]>(getHPIQuery); // execute the query and retrieve the results
    const totalHpi = hpi.reduce(
      (total: number, item: any) => total + item.hpi_2020,
      0
    );
    const averageHpi = totalHpi / hpi.length;

    connection.end(); // close the connection
    return NextResponse.json({
      postcode: postcode,
      houseType: data.houseType,
      houseAge: data.houseAge ? parseFloat(data.houseAge.toString()) : null,
      houseBedrooms: data.houseBedrooms
        ? parseFloat(data.houseBedrooms.toString())
        : null,
      houseSize: data.houseSize ? parseFloat(data.houseSize.toString()) : null,
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      itl3: itl3,
      gdhi: gdhi,
      hpi: averageHpi,
      buildPrice: buildPrice,
      averageRent: averageRent,
      rentAdjustements: rentAdjustements,
      averageSocialRent: averageSocialRent,
      numberOfTransactions: numberOfTransactions,
      granularityPostcode: granularityPostcode,
      pricesPaid: pricesPaid,
    }); // return the results
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}
