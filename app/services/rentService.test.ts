// __tests__/rentService.test.ts
import { rentService } from "../services/rentService"; // Adjust the path according to your structure
import { rentRepo } from "../data/rentRepo"; // Adjust the path according to your structure

jest.mock("../data/rentRepo");

describe("rentService.getByITL3", () => {
  const mockRentData = 1500; // Mock rent data in some currency (e.g., 1500 per month)

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return rent data for a valid ITL3 code", async () => {
    // Arrange
    const itl3 = "ITL3-123";
    (rentRepo.getRentByITL3 as jest.Mock).mockResolvedValueOnce(mockRentData);

    // Act
    const result = await rentService.getByITL3(itl3);

    // Assert
    expect(rentRepo.getRentByITL3).toHaveBeenCalledWith(itl3);
    expect(result).toEqual(mockRentData);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch rent data";
    (rentRepo.getRentByITL3 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(rentService.getByITL3("ITL3-123")).rejects.toThrow(
      errorMessage
    );
  });
});