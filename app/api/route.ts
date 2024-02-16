// import the Request and Response classes
import { NextResponse, NextRequest } from "next/server";

// import mysql2/promise for mysql connectivity
import mysql from "mysql2/promise";

// import GetDBSettings to retrieve the database connection environment parameters, and the IDBSettings object interface
import { GetDBSettings, IDBSettings } from "@/sharedCode/common";
const connectionParams = GetDBSettings();

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
    const postcodeParts = data.housePostcode.split(/\s+/); // split the postcode based on the white space, for example SE17 1PE into SE17 and 1PE
    const postcodeLvl1 = postcodeParts[0].replace(/[^a-zA-Z]/g, ""); // extract only the characters of the first part, e.g SE
    const postcodeLvl2 = postcodeParts[0]; //  exctract the first part in total , e.g., SE17
    const postcodeLvl3 = postcodeParts[0] + " " + postcodeParts[1][0]; // extract the first part and add the secon, e.g., SE17 1

    // create the progressive queries
    const minimumNumberEntries = 30; // minimum number of entries to create the average
    const getPricesLvl3Query = `SELECT COUNT(*) FROM fairhold.pricesPaid WHERE propertyType = '${data.houseType}' AND postcode LIKE '${postcodeLvl3}%'`; // create the sql query and count how many items meet the criteria
    const [numberPricesPaidLvl3] = await connection.execute(getPricesLvl3Query); // execute the query and retrieve the results
    console.log(NextResponse.json(numberPricesPaidLvl3));

    const getBuildPriceQuery = `SELECT * FROM fairhold.buildPrices WHERE houseType = '${data.houseType}'`; // create the sql query

    //const [pricesPaid] = await connection.execute(getPricesPaidQuery); // execute the query and retrieve the results
    const [buildPrice] = await connection.execute(getBuildPriceQuery); // execute the query and retrieve the results

    connection.end(); // close the connection
    return NextResponse.json({
      //pricesPaid: pricesPaid,
      buildPrice: buildPrice,
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

/* // import the Request and Response classes
import { NextResponse, NextRequest } from "next/server";

// 1. populate the connection parameters
let connectionParams = GetDBSettings();

// define and export the GET handler function
export async function GET(request: Request) {
  

    // 3. create a query to fetch data
    const test_postcode = "SE17 1PE";
    let get_exp_query = "";
    

    // 4. exec the query and retrieve the results
   

    // 5. close the connection when done
    

    // return the results as a JSON API response
    
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
} */
