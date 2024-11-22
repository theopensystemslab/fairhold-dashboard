import { POST } from "../api/route";
import * as calculationService from "../services/calculationService";
import calculateFairhold from "../models/testClasses";
import { NextResponse } from "next/server";
import { calculationSchema, Calculation } from "../schemas/calculationSchema";

// Mock dependencies
jest.mock("../services/calculationService");
jest.mock("../models/testClasses", () => jest.fn()); // Mock calculateFairhold
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ data })),
  },
}));

const callResponse = (res: unknown) => {
  return res;
};

describe("POST API Route", () => {
  const mockRequest = (data: Calculation | string) => ({
    json: jest.fn().mockResolvedValueOnce(data),
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it("should return processed data for valid apiSchema input", async () => {
    const validApiInput = calculationSchema.parse({
      housePostcode: "SE17 1PE",
      houseSize: 100,
      houseAge: 3,
      houseBedrooms: 2,
      houseType: "D",
      maintenancePercentage: 0.02,
    });

    const householdData = {
      /* mock household data */
    };

    const processedData = {
      /* mock processed data */
    };

    // Set mock return values
    (calculationService.getHouseholdData as jest.Mock).mockResolvedValueOnce(
      householdData
    );
    (calculateFairhold as jest.Mock).mockReturnValueOnce(processedData);

    const req = mockRequest(validApiInput);
    const res = await POST(req as unknown as Request);

    // Assertions
    expect(calculationService.getHouseholdData).toHaveBeenCalledWith(
      validApiInput
    );
    expect(calculateFairhold).toHaveBeenCalledWith(householdData);
    expect(res).toEqual(NextResponse.json(processedData));
  });

  it("should return an error for invalid input", async () => {
    const invalidInput = "invalid input";

    const req = mockRequest(invalidInput);

    const res = await POST(req as unknown as Request);
    callResponse(res);

    // Assertions for the expected error response
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      { status: 500 }
    );
  });

  it("should handle service errors", async () => {
    const validApiInput = calculationSchema.parse({
      housePostcode: "SE17 1PE",
      houseSize: 100,
      houseAge: 3,
      houseBedrooms: 2,
      houseType: "D",
      maintenancePercentage: 0.02,
    });

    const errorMessage = "Service error";

    // Mock service throwing an error
    (calculationService.getHouseholdData as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const req = mockRequest(validApiInput);
    const res = await POST(req as unknown as Request);
    callResponse(res);

    // Assertions
    expect(calculationService.getHouseholdData).toHaveBeenCalledWith(
      validApiInput
    );
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: errorMessage },
      { status: 500 }
    );
  });
});
