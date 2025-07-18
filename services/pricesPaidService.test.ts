// __tests__/pricesPaidService.test.ts
import { pricesPaidService } from "./pricesPaidService"; // Adjust the path according to your structure
import { pricesPaidRepo } from "../data/pricesPaidRepo"; // Adjust the path according to your structure

jest.mock("../data/pricesPaidRepo");

describe("pricesPaidService.getPricesPaidByPostcodeAndHouseType", () => {
  const mockPricesPaidData = {
    averagePrice: 280000,
    numberOfTransactions: 50,
    granularityPostcode: "SE17",
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return prices paid data for a valid postcode and house type", async () => {
    // Arrange
    const postcodeDistrict = "SE17";
    const postcodeArea = "SE";
    const postcodeSector = "SE17 1";
    const houseType = "D"; // Detached house, for example
    (
      pricesPaidRepo.getPricesPaidByPostcodeAndHouseType as jest.Mock
    ).mockResolvedValueOnce(mockPricesPaidData);

    // Act
    const result = await pricesPaidService.getPricesPaidByPostcodeAndHouseType(
      postcodeDistrict,
      postcodeArea,
      postcodeSector,
      houseType
    );

    // Assert
    expect(
      pricesPaidRepo.getPricesPaidByPostcodeAndHouseType
    ).toHaveBeenCalledWith(
      postcodeDistrict,
      postcodeArea,
      postcodeSector,
      houseType
    );
    expect(result).toEqual(mockPricesPaidData);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch prices paid data";
    (
      pricesPaidRepo.getPricesPaidByPostcodeAndHouseType as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(
      pricesPaidService.getPricesPaidByPostcodeAndHouseType(
        "SE17",
        "SE",
        "SE17 1",
        "D"
      )
    ).rejects.toThrow(errorMessage);
  });
});
