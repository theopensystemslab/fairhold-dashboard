import calculateFairhold from "./calculateFairhold";
import { ResponseData } from "./calculateFairhold";
import { Household } from "./Household";
import { ValidPostcode } from "../schemas/calculationSchema";
import { parse as parsePostcode } from "postcode";
import { socialRentAdjustments } from "./testHelpers";
import { maintenancePercentageSchema } from "../schemas/calculationSchema";
import { z } from "zod";

type MaintenancePercentage = z.infer<typeof maintenancePercentageSchema>;

jest.mock("./Household", () => {
  return {
    Household: jest.fn().mockImplementation((data) => data),
  };
});

jest.mock("./Property", () => {
  return {
    Property: jest.fn().mockImplementation((data) => data),
  };
});

jest.mock("./ForecastParameters", () => {
  return {
    createForecastParameters: jest.fn((maintenancePercentage) => ({
      maintenancePercentage,
    })),
  };
});

describe("calculateFairhold", () => {
  const validResponseData: ResponseData = {
    postcode: parsePostcode("SE17 1PE") as ValidPostcode,
    houseType: "D",
    houseBedrooms: 3,
    buildPrice: 2000,
    houseAge: 10,
    houseSize: 95,
    maintenancePercentage: 0.015,
    averagePrice: 300000,
    itl3: "UKI3",
    gdhi: 25000,
    averageRentMonthly: 800,
    socialRentAverageEarning: 0.8,
    socialRentAdjustments: socialRentAdjustments,
    hpi: 1.5,
    kwhCostPence: 30,
  };

  it("throws an error if itl3 is missing or empty", () => {
    const invalidData = { ...validResponseData, itl3: "" };
    expect(() => calculateFairhold(invalidData)).toThrow(
      "itl3 data is missing or empty"
    );
  });

  it("throws an error if buildPrice is missing or empty", () => {
    const invalidData = { ...validResponseData, buildPrice: NaN };
    expect(() => calculateFairhold(invalidData)).toThrow(
      "buildPrice data is missing or empty"
    );
  });

  it("throws an error if maintenancePercentage is missing or empty", () => {
    const invalidData = {
      ...validResponseData,
      maintenancePercentage: "" as unknown as MaintenancePercentage,
    };
    expect(() => calculateFairhold(invalidData)).toThrow(
      "maintenancePercentage data is missing or empty"
    );
  });

  it("creates a Household instance with correct parameters", () => {
    const household = calculateFairhold(validResponseData);
    expect(household).toBeDefined();
  });

  it("calculates houseSize if it is undefined", () => {
    const responseDataWithUndefinedSize = {
      ...validResponseData,
      houseSize: undefined,
    };

    calculateFairhold(responseDataWithUndefinedSize);

    expect(Household).toHaveBeenCalledWith(
      expect.objectContaining({
        property: expect.objectContaining({
          size: 95,
        }),
      })
    );
  });

  it("assigns max size for bedrooms > 6", () => {
    const responseDataWithLargeBedrooms = {
      ...validResponseData,
      houseBedrooms: 7,
      houseSize: undefined,
    };

    calculateFairhold(responseDataWithLargeBedrooms);

    expect(Household).toHaveBeenCalledWith(
      expect.objectContaining({
        property: expect.objectContaining({
          size: 135,
        }),
      })
    );
  });
});
