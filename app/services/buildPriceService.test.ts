// __tests__/buildPriceService.test.ts
import { buildPriceService } from "./buildPriceService"; // Adjust the import according to your file structure
import { buildPriceRepo } from "../data/buildPriceRepo"; // Adjust the import accordingly

jest.mock("../data/buildPriceRepo"); // Mock the buildPriceRepo module

describe("buildPriceService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return the build price for a given house type", async () => {
    const houseType = "detached"; // Example house type
    const expectedPrice = 250000; // Example expected price

    // Mock the repository response
    (
      buildPriceRepo.getBuildPriceByHouseType as jest.Mock
    ).mockResolvedValueOnce(expectedPrice);

    // Call the service function
    const result = await buildPriceService.getBuildPriceByHouseType(houseType);

    // Assertions
    expect(result).toBe(expectedPrice); // Check that the result matches the expected price
    expect(buildPriceRepo.getBuildPriceByHouseType).toHaveBeenCalledWith(
      houseType
    ); // Ensure the repository was called with the correct argument
  });

  it("should handle errors thrown by the repository", async () => {
    const houseType = "apartment"; // Example house type

    // Mock the repository to throw an error
    const errorMessage = `Data error: Unable to find build price for house type ${houseType}`;
    (
      buildPriceRepo.getBuildPriceByHouseType as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage));

    // Call the service function and expect it to throw
    await expect(
      buildPriceService.getBuildPriceByHouseType(houseType)
    ).rejects.toThrow(
      `Data error: Unable to find build price for house type ${houseType}`
    );
  });
});
