import { PrismaClient } from "@prisma/client";
import { buildPriceService } from "./buildPriceService";
import { gasPriceService } from "./gasPriceService";
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
    
    // may not be available (if user only enters outward postcode, aka district)
    const postcodeSector = postcode.sector ?? null; // extract only the characters for the sector, SE17 1
    
    const bedrooms = input.houseBedrooms <= 4 ? input.houseBedrooms : 4; // rental data only goes up to 4br TODO: do we want to increase the weight? 

    const itl3 = await itlService.getByPostcodeDistrict(postcodeDistrict);

    if (!itl3) {
      throw new APIError({
        code: "ITL3_NOT_FOUND",
        message: "ITL3 region not found",
        status: 400
      });
    }
    
    const itl1 = itl3.substring(0,3)
    const gdhi = await gdhiService.getByITL1(itl1);
    const kwhCostPence = await gasPriceService.getByITL3(itl3);
    const hpi = await hpiService.getByITL3(itl3);
    const buildPrice = await buildPriceService.getBuildPriceByHouseType(input.houseType);
    
    const { averagePrice, numberOfTransactions, granularityPostcode } =
      await pricesPaidService.getPricesPaidByPostcodeAndHouseType(
        postcodeDistrict,
        postcodeArea,
        postcodeSector,
        input.houseType
      );

    const averageRentMonthly = await rentService.getByITL3AndBedrooms(itl3, bedrooms); 

    const socialRentAdjustments = await socialRentAdjustmentsService.getAdjustments();
    const socialRentAverageEarning = await socialRentEarningsService.getByITL3(itl3)

    return {
      postcode: input.housePostcode,
      houseType: input.houseType,
      houseAge: input.houseAge,
      houseBedrooms: input.houseBedrooms,
      maintenanceLevel: input.maintenanceLevel,
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
