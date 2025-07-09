// __tests__/itlService.test.ts
import { itlService } from "./itlService"; // Adjust the path according to your structure
import { itlRepo } from "../data/itlRepo"; // Adjust the path according to your structure

jest.mock("../data/itlRepo");

describe("itlService.getByPostcodeDistrict", () => {
  const mockITL3 = "ITL3-123";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return ITL3 for a valid postcode district", async () => {
    // Arrange
    const postcodeDistrict = "SE17";
    (itlRepo.getItl3ByPostcodeDistrict as jest.Mock).mockResolvedValueOnce(
      mockITL3
    );

    // Act
    const result = await itlService.getByPostcodeDistrict(postcodeDistrict);

    // Assert
    expect(itlRepo.getItl3ByPostcodeDistrict).toHaveBeenCalledWith(
      postcodeDistrict
    );
    expect(result).toBe(mockITL3);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch ITL3";
    (itlRepo.getItl3ByPostcodeDistrict as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(itlService.getByPostcodeDistrict("SE17")).rejects.toThrow(
      errorMessage
    );
  });
});
