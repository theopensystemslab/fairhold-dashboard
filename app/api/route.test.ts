import { POST } from "../api/route";
import * as calculationService from "../../services/calculationService";
import calculateFairhold from "../../models/calculateFairhold";
import { NextResponse } from "next/server";
import { APIError } from "../../lib/calculator/exceptions";

// Mock dependencies
jest.mock("../services/calculationService");
jest.mock("../models/calculateFairhold", () => jest.fn()); // Mock calculateFairhold
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ data })),
  },
}));

const callResponse = (res: unknown) => {
  return res;
};

describe("POST API Route", () => {
  const mockRequest = (data: unknown) => ({
    json: jest.fn().mockResolvedValueOnce(data),
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it("should return processed data for valid apiSchema input", async () => {
    const validApiInput = {
      housePostcode: "SE17 1PE",
      houseAge: 3,
      houseBedrooms: 2,
      houseType: "D",
      maintenanceLevel: "medium",
    };

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
    expect(calculationService.getHouseholdData).toHaveBeenCalledWith({
      ...validApiInput,
      // Parsed postcode object
      housePostcode: {
        outcode: "SE17",
        incode: "1PE",
        area: "SE",
        district: "SE17",
        sector: "SE17 1",
        postcode: "SE17 1PE"
      },
    });
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
      expect.objectContaining({
        error: expect.objectContaining({ code: "UNHANDLED_EXCEPTION" }),
      }),
      { status: 500 }
    );
  });

  it("should handle service errors", async () => {
    const validApiInput = {
      housePostcode: "SE17 1PE",
      houseAge: 3,
      houseBedrooms: 2,
      houseType: "D",
      maintenanceLevel: "medium",
    };

    const errorMessage = "Service error";

    // Mock service throwing an error
    (calculationService.getHouseholdData as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const req = mockRequest(validApiInput);
    const res = await POST(req as unknown as Request);
    callResponse(res);

    // Assertions
    expect(calculationService.getHouseholdData).toHaveBeenCalledWith({
      ...validApiInput,
      // Parsed postcode object
      housePostcode: {
        outcode: "SE17",
        incode: "1PE",
        area: "SE",
        district: "SE17",
        sector: "SE17 1",
        postcode: "SE17 1PE"
      },
    });
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error: {
          code: "UNHANDLED_EXCEPTION",
          message: "Service error",
        },
      },
      { status: 500 }
    );
  });

  it("should handle APIError correctly", async () => {
    const validApiInput = {
      housePostcode: "SE17 1PE",
      houseAge: 3,
      houseBedrooms: 2,
      houseType: "D",
      maintenanceLevel: "medium",
    };
  
    // Create an APIError instance
    const apiError = new APIError({
      code: "UNHANDLED_EXCEPTION", 
      message: "API error message", 
      status: 400
    });
        
    // Mock service throwing an APIError
    (calculationService.getHouseholdData as jest.Mock).mockRejectedValueOnce(apiError);
  
    const req = mockRequest(validApiInput);
    const res = await POST(req as unknown as Request);
    callResponse(res);
  
    // Assertions
    expect(calculationService.getHouseholdData).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: apiError },
      { status: 400 }
    );
  });
});
