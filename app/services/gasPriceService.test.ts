// __tests__/gasPriceService.test.ts
import { gasPriceService } from "../services/gasPriceService"; // Adjust path according to your structure
import { gasPriceRepo } from "../data/gasPriceRepo"; // Adjust path according to your structure

jest.mock("../data/gasPriceRepo");

describe("gasPriceService.getByITL3", () => {
  const mockGasPrice = 1200;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return gas bill for a valid ITL3", async () => {
    // Arrange
    const itl3 = "ITL3-123";
    (gasPriceRepo.getGasPriceByITL3 as jest.Mock).mockResolvedValueOnce(
      mockGasPrice
    );

    // Act
    const result = await gasPriceService.getByITL3(itl3);

    // Assert
    expect(gasPriceRepo.getGasPriceByITL3).toHaveBeenCalledWith(itl3);
    expect(result).toBe(mockGasPrice);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch gas bill";
    (gasPriceRepo.getGasPriceByITL3 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(gasPriceService.getByITL3("ITL3-123")).rejects.toThrow(
      errorMessage
    );
  });
});
