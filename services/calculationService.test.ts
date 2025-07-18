import { getHouseholdData } from "./calculationService";
import { itlService } from "./itlService";
import { gdhiService } from "./gdhiService";
import { gasPriceService } from "./gasPriceService";
import { hpiService } from "./hpiService";
import { buildPriceService } from "./buildPriceService";
import { pricesPaidService } from "./pricesPaidService";
import { socialRentAdjustmentsService } from "./socialRentAdjustmentsService";
import { socialRentEarningsService } from "./socialRentEarningsService";
import { rentService } from "./rentService";
import { parse } from "postcode";
import { z } from "zod";
import { Calculation, maintenanceLevelSchema, PostcodeScales } from "../schemas/calculationSchema";
import { APIError } from "../lib/calculator/exceptions";
import { HouseType } from "../models/Property";
import { MaintenanceLevel } from "../models/constants";

jest.mock("./itlService");
jest.mock("./gdhiService");
jest.mock("./gasPriceService");
jest.mock("./hpiService");
jest.mock("./buildPriceService");
jest.mock("./pricesPaidService");
jest.mock("./socialRentAdjustmentsService");
jest.mock("./socialRentEarningsService");
jest.mock("./rentService");

jest.mock("../data/db", () => {
  return {
    __esModule: true,
    default: {
      $disconnect: jest.fn().mockResolvedValue(undefined),
      socialRent: {
        aggregate: jest.fn().mockReturnValue(Promise.resolve([])),
      },
      pricesPaidSummary: {
        findFirst: jest.fn().mockReturnValue(Promise.resolve([])),
      },
    },
  };
});

describe("getHouseholdData", () => {
  const validPostcode = parse("SE17 1PE");
  if (!validPostcode.valid) {
    throw new Error("Invalid postcode");
  }

  interface MockInputType {
    housePostcode: PostcodeScales;
    houseType: "D" | "S" | "T" | "F";
    houseAge: number;
    houseBedrooms: number;
    maintenanceLevel: z.infer<typeof maintenanceLevelSchema>;
  }

  const mockInput: MockInputType = {
    housePostcode: validPostcode,
    houseType: "D",
    houseAge: 20,
    houseBedrooms: 3,
    maintenanceLevel: "medium"
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return household data correctly", async () => {
    const mockITL3 = "TLI44";
    const mockGDHI = 30000;
    const mockGasPriceYearly = 1200;
    const mockHPI = 1.05;
    const mockBuildPrice = 250000;
    const mockPricesPaidSummary = {
      averagePrice: 280000,
      numberOfTransactions: 50,
      granularityPostcode: "SE17",
    };
    const mockAverageRentMonthly = 1500;
    const mockSocialRentAdjustments = [
      { year: "2022", inflation: 2, additional: 3, total: 5 },
    ];
    const mockSocialRentAverageEarning = 25000;

    (itlService.getByPostcodeDistrict as jest.Mock).mockResolvedValueOnce(
      mockITL3
    );
    (gdhiService.getByITL1 as jest.Mock).mockResolvedValueOnce(mockGDHI);
    (gasPriceService.getByITL3 as jest.Mock).mockResolvedValueOnce(
      mockGasPriceYearly
    );
    (hpiService.getByITL3 as jest.Mock).mockResolvedValueOnce(mockHPI);
    (
      buildPriceService.getBuildPriceByHouseType as jest.Mock
    ).mockResolvedValueOnce(mockBuildPrice);
    (
      pricesPaidService.getPricesPaidByPostcodeAndHouseType as jest.Mock
    ).mockResolvedValueOnce(mockPricesPaidSummary);
    (rentService.getByITL3AndBedrooms as jest.Mock).mockResolvedValueOnce(
      mockAverageRentMonthly
    );
    (
      socialRentAdjustmentsService.getAdjustments as jest.Mock
    ).mockResolvedValueOnce(mockSocialRentAdjustments);
    (socialRentEarningsService.getByITL3 as jest.Mock).mockResolvedValueOnce(
      mockSocialRentAverageEarning
    );

    const result = await getHouseholdData(mockInput);

    // Assertions
    expect(result).toEqual({
      postcode: mockInput.housePostcode,
      houseType: mockInput.houseType,
      houseAge: mockInput.houseAge,
      houseBedrooms: mockInput.houseBedrooms,
      maintenanceLevel: mockInput.maintenanceLevel,
      averagePrice: parseFloat(mockPricesPaidSummary.averagePrice.toFixed(2)),
      itl3: mockITL3,
      gdhi: mockGDHI,
      hpi: mockHPI,
      buildPrice: mockBuildPrice,
      averageRentMonthly: mockAverageRentMonthly,
      socialRentAdjustments: mockSocialRentAdjustments,
      socialRentAverageEarning: mockSocialRentAverageEarning,
      numberOfTransactions: mockPricesPaidSummary.numberOfTransactions,
      granularityPostcode: mockPricesPaidSummary.granularityPostcode,
      kwhCostPence: mockGasPriceYearly,
    });
  });

  it("should use 4 bedrooms for rent lookup if houseBedrooms > 4", async () => {
    const validPostcode = parse("SE17 1PE");
    if (!validPostcode.valid) throw new Error("Invalid postcode");
    const mockInput = {
      housePostcode: validPostcode,
      houseType: "D",
      houseAge: 20,
      houseBedrooms: 6, // > 4 triggers the else branch
      houseSize: 100,
      maintenanceLevel: "medium"
    };

    (itlService.getByPostcodeDistrict as jest.Mock).mockResolvedValueOnce("TLI44");
    (gdhiService.getByITL1 as jest.Mock).mockResolvedValueOnce(30000);
    (gasPriceService.getByITL3 as jest.Mock).mockResolvedValueOnce(1200);
    (hpiService.getByITL3 as jest.Mock).mockResolvedValueOnce(1.05);
    (buildPriceService.getBuildPriceByHouseType as jest.Mock).mockResolvedValueOnce(250000);
    (pricesPaidService.getPricesPaidByPostcodeAndHouseType as jest.Mock).mockResolvedValueOnce({
      averagePrice: 280000,
      numberOfTransactions: 50,
      granularityPostcode: "SE17",
    });
    (rentService.getByITL3AndBedrooms as jest.Mock).mockResolvedValueOnce(1500);
    (socialRentAdjustmentsService.getAdjustments as jest.Mock).mockResolvedValueOnce([
      { year: "2022", inflation: 2, additional: 3, total: 5 },
    ]);
    (socialRentEarningsService.getByITL3 as jest.Mock).mockResolvedValueOnce(25000);

    await getHouseholdData(mockInput as Calculation);

    // Check that rentService was called with 4 bedrooms, not 6
    expect(rentService.getByITL3AndBedrooms).toHaveBeenCalledWith("TLI44", 4);
  });

  it("should throw an error when service fails", async () => {
    const errorMessage = "Service error";
    (itlService.getByPostcodeDistrict as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(getHouseholdData(mockInput)).rejects.toThrow(
      `Service error: Unable to generate household. Message: ${errorMessage}`
    );
  });

  it("should pass through APIError when thrown by a service", async () => {
    const apiError = new APIError({
      code: "ITL3_NOT_FOUND",
      message: "ITL3 region not found",
      status: 400
    });
    
    // this is the error we want to throw
    (itlService.getByPostcodeDistrict as jest.Mock).mockRejectedValueOnce(apiError);

    // all other mocks should return empty/default values to prevent other errors
    (gdhiService.getByITL1 as jest.Mock).mockResolvedValueOnce(null);
    (gasPriceService.getByITL3 as jest.Mock).mockResolvedValueOnce(null);
    (hpiService.getByITL3 as jest.Mock).mockResolvedValueOnce(null);
    (buildPriceService.getBuildPriceByHouseType as jest.Mock).mockResolvedValueOnce(null);
  })

  it("should throw APIError when ITL3 region is not found", async () => {
    // Arrange: mock ITL3 service to return null (not found)
    (itlService.getByPostcodeDistrict as jest.Mock).mockResolvedValueOnce(null);

    // Use a valid mock input
    const validPostcode = parse("SE17 1PE");
    if (!validPostcode.valid) throw new Error("Invalid postcode");
    const mockInput = {
      housePostcode: validPostcode,
      houseType: "D",
      houseAge: 20,
      houseBedrooms: 3,
      houseSize: 100,
      maintenanceLevel: "medium"
    };

    // Act & Assert
    await expect(getHouseholdData(mockInput as Calculation)).rejects.toMatchObject({
      code: "ITL3_NOT_FOUND",
      message: "ITL3 region not found",
      status: 400
    });
  });
    
  it("should work when only an outcode is entered", async () => {
    const outcode = "SE17";
    const mockInput = {
      housePostcode: {
        outcode: outcode,
        incode: null,
        area: "SE",
        district: "SE17",
        sector: null,
        postcode: null,
      },
      houseType: "D" as HouseType,
      houseAge: 20,
      houseBedrooms: 3,
      maintenanceLevel: "medium" as MaintenanceLevel,
    };

    const mockITL3 = "TLI44";
    const mockGDHI = 30000;
    const mockGasPriceYearly = 7;
    const mockHPI = 1.05;
    const mockBuildPrice = 250000;
    const mockPricesPaidSummary = {
      averagePrice: 280000,
      numberOfTransactions: 50,
      granularityPostcode: outcode,
    };
    const mockAverageRentMonthly = 1500;
    const mockSocialRentAdjustments = [
      { year: "2022", inflation: 2, additional: 3, total: 5 },
    ];
    const mockSocialRentAverageEarning = 25000;

    (itlService.getByPostcodeDistrict as jest.Mock).mockResolvedValueOnce(
      mockITL3
    );
    (gdhiService.getByITL1 as jest.Mock).mockResolvedValueOnce(mockGDHI);
    (gasPriceService.getByITL3 as jest.Mock).mockResolvedValueOnce(
      mockGasPriceYearly
    );
    (hpiService.getByITL3 as jest.Mock).mockResolvedValueOnce(mockHPI);
    (
      buildPriceService.getBuildPriceByHouseType as jest.Mock
    ).mockResolvedValueOnce(mockBuildPrice);
    (
      pricesPaidService.getPricesPaidByPostcodeAndHouseType as jest.Mock
    ).mockResolvedValueOnce(mockPricesPaidSummary);
    (rentService.getByITL3AndBedrooms as jest.Mock).mockResolvedValueOnce(
      mockAverageRentMonthly
    );
    (
      socialRentAdjustmentsService.getAdjustments as jest.Mock
    ).mockResolvedValueOnce(mockSocialRentAdjustments);
    (socialRentEarningsService.getByITL3 as jest.Mock).mockResolvedValueOnce(
      mockSocialRentAverageEarning
    );

    const result = await getHouseholdData(mockInput);
    console.log({result})

    expect(result).toEqual({
      postcode: mockInput.housePostcode,
      houseType: mockInput.houseType,
      houseAge: mockInput.houseAge,
      houseBedrooms: mockInput.houseBedrooms,
      maintenanceLevel: mockInput.maintenanceLevel,
      averagePrice: parseFloat(mockPricesPaidSummary.averagePrice.toFixed(2)),
      itl3: mockITL3,
      gdhi: mockGDHI,
      hpi: mockHPI,
      buildPrice: mockBuildPrice,
      averageRentMonthly: mockAverageRentMonthly,
      socialRentAdjustments: mockSocialRentAdjustments,
      socialRentAverageEarning: mockSocialRentAverageEarning,
      numberOfTransactions: mockPricesPaidSummary.numberOfTransactions,
      granularityPostcode: mockPricesPaidSummary.granularityPostcode,
      kwhCostPence: mockGasPriceYearly,
    });
    expect(itlService.getByPostcodeDistrict).toHaveBeenCalledWith("SE17");
  });

});
