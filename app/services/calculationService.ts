import { PrismaClient } from "@prisma/client";
import { buildPriceService } from "./buildPriceService";
import { gasBillService } from "./gasBillService";
import { gdhiService } from "./gdhiService";
import { hpiService } from "./hpiService";
import { itlService } from "./itlService";
import { pricesPaidService } from "./pricesPaidService";
import { socialRentAdjustmentsService } from "./socialRentAdjustmentsService";
import { socialRentEarningsService } from "./socialRentEarningsService";
import { rentService } from "./rentService"

import { Calculation } from "../schemas/calculationSchema";
import { APIError } from "../lib/exceptions";

const prisma = new PrismaClient();


export const getHouseholdData = async (input: Calculation) => {

  try {
    // data are going to be queried at different levels of granularity based on the postcode
    const postcode = input.housePostcode;
    const postcodeArea = postcode.area; // extract only the characters for the area, e.g SE
    const postcodeDistrict = postcode.district; // extract only characters for the district, SE17
    const postcodeSector = postcode.sector; // extract only the characters for the sector, SE17 1

    const itl3 = await itlService.getByPostcodeDistrict(postcodeDistrict);
    const gdhi = await gdhiService.getByITL3(itl3);
    const kwhCostPence = await gasBillService.getByITL3(itl3);
    const hpi = await hpiService.getByITL3(itl3);
    const buildPrice = await buildPriceService.getBuildPriceByHouseType(input.houseType);

    const { averagePrice, numberOfTransactions, granularityPostcode } =
      await pricesPaidService.getPricesPaidByPostcodeAndHouseType(
        postcodeDistrict,
        postcodeArea,
        postcodeSector,
        input.houseType
      );

    const averageRentMonthly = await rentService.getByITL3(itl3); 

    const socialRentAdjustments = await socialRentAdjustmentsService.getAdjustments();
    const socialRentAverageEarning = await socialRentEarningsService.getByITL3(itl3)

    return {
      postcode: input.housePostcode,
      houseType: input.houseType,
      houseAge: input.houseAge,
      houseBedrooms: input.houseBedrooms,
      houseSize: input.houseSize,
      maintenancePercentage: input.maintenancePercentage,
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      itl3,
      gdhi,
      hpi,
      buildPrice,
      averageRentMonthly,
      socialRentAdjustments,
      socialRentAverageEarning,
      numberOfTransactions,
      granularityPostcode,
      kwhCostPence,
    };

  } catch (err) {
    if (err instanceof APIError) throw err;
    
    throw Error(
      `Service error: Unable to generate household. Message: ${(err as Error).message}`
    );
  } finally {
    await prisma.$disconnect();
  }
};
