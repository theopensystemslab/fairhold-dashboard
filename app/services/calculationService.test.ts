// __tests__/householdData.test.ts
import { getHouseholdData } from "./calculationService";
import { itlService } from "./itlService";
import { gdhiService } from "./gdhiService";
import { gasBillService } from "./gasBillService";
import { hpiService } from "./hpiService";
import { buildPriceService } from "./buildPriceService";
import { pricesPaidService } from "./pricesPaidService";
import { socialRentAdjustmentsService } from "./socialRentAdjustmentsService";
import { socialRentEarningsService } from "./socialRentEarningsService";
import { rentService } from "./rentService";
import { parse } from "postcode";
import { ValidPostcode } from "../schemas/apiSchema";

jest.mock("./itlService");
jest.mock("./gdhiService");
jest.mock("./gasBillService");
jest.mock("./hpiService");
jest.mock("./buildPriceService");
jest.mock("./pricesPaidService");
jest.mock("./socialRentAdjustmentsService");
jest.mock("./socialRentEarningsService");
jest.mock("./rentService");

// Mock the Prisma client
jest.mock("../data/db", () => {
  return {
    __esModule: true,
    default: {
      $disconnect: jest.fn().mockResolvedValue(undefined), // Mock disconnect to resolve successfully
      socialRent: {
        aggregate: jest.fn().mockReturnValue(Promise.resolve([])), // Mock aggregate method
      },
      pricesPaid: {
        aggregate: jest.fn().mockReturnValue(Promise.resolve([])), // Mock aggregate for pricesPaid as well
      },
      // Add any other Prisma model methods that need to be mocked
    },
  };
});

describe("getHouseholdData", () => {
  const validPostcode = parse("SE17 1PE");
  if (!validPostcode.valid) {
    throw new Error("Invalid postcode");
  }

  interface MockInputType {
    housePostcode: ValidPostcode;
    houseType: "D" | "S" | "T" | "F";
    houseAge: number;
    houseBedrooms: number;
    houseSize: number;
    maintenancePercentage: "0.015" | "0.02" | "0.0375";
  }

  const mockInput: MockInputType = {
    housePostcode: validPostcode,
    houseType: "D",
    houseAge: 20,
    houseBedrooms: 3,
    houseSize: 100,
    maintenancePercentage: "0.02"
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return household data correctly", async () => {
    const mockITL3 = "ITL3-123";
    const mockGDHI = 30000;
    const mockGasBillYearly = 1200;
    const mockHPI = 1.05;
    const mockBuildPrice = 250000;
    const mockPricesPaid = {
      averagePrice: 280000,
      numberOfTransactions: 50,
      granularityPostcode: "SE17",
    };
    const mockAverageRentMonthly = 1500;
    const mockSocialRentAdjustments = [
      { year: "2022", inflation: 2, additional: 3, total: 5 },
    ];
    const mockSocialRentAverageEarning = 25000;

    // Mocking the services' responses
    (itlService.getByPostcodeDistrict as jest.Mock).mockResolvedValueOnce(
      mockITL3
    );
    (gdhiService.getByITL3 as jest.Mock).mockResolvedValueOnce(mockGDHI);
    (gasBillService.getByITL3 as jest.Mock).mockResolvedValueOnce(
      mockGasBillYearly
    );
    (hpiService.getByITL3 as jest.Mock).mockResolvedValueOnce(mockHPI);
    (
      buildPriceService.getBuildPriceByHouseType as jest.Mock
    ).mockResolvedValueOnce(mockBuildPrice);
    (
      pricesPaidService.getPricesPaidByPostcodeAndHouseType as jest.Mock
    ).mockResolvedValueOnce(mockPricesPaid);
    (rentService.getByITL3 as jest.Mock).mockResolvedValueOnce(
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
      houseSize: mockInput.houseSize,
      averagePrice: parseFloat(mockPricesPaid.averagePrice.toFixed(2)),
      itl3: mockITL3,
      gdhi: mockGDHI,
      hpi: mockHPI,
      buildPrice: mockBuildPrice,
      averageRentMonthly: mockAverageRentMonthly,
      socialRentAdjustments: mockSocialRentAdjustments,
      socialRentAverageEarning: mockSocialRentAverageEarning,
      numberOfTransactions: mockPricesPaid.numberOfTransactions,
      granularityPostcode: mockPricesPaid.granularityPostcode,
      gasBillYearly: mockGasBillYearly,
    });
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
});
