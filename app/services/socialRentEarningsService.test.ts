// __tests__/socialRentEarningsService.test.ts
import { socialRentEarningsService } from "../services/socialRentEarningsService"; // Adjust the path according to your structure
import { socialRentEarningsRepo } from "../data/socialRentEarningsRepo"; // Adjust the path according to your structure

jest.mock("../data/socialRentEarningsRepo");

describe("socialRentEarningsService.getByITL3", () => {
  const mockEarningsData = 25000; // Mock social rent earnings data for a given ITL3

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return social rent earnings by ITL3", async () => {
    // Arrange
    (
      socialRentEarningsRepo.getSocialRentEarningsByITL3 as jest.Mock
    ).mockResolvedValueOnce(mockEarningsData);

    // Act
    const result = await socialRentEarningsService.getByITL3("ITL3-123");

    // Assert
    expect(
      socialRentEarningsRepo.getSocialRentEarningsByITL3
    ).toHaveBeenCalledWith("ITL3-123");
    expect(result).toEqual(mockEarningsData);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch social rent earnings";
    (
      socialRentEarningsRepo.getSocialRentEarningsByITL3 as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(
      socialRentEarningsService.getByITL3("ITL3-123")
    ).rejects.toThrow(errorMessage);
  });
});
