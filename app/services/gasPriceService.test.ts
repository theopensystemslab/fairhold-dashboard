// __tests__/gasBillService.test.ts
import { gasBillService } from "../services/gasBillService"; // Adjust path according to your structure
import { gasBillRepo } from "../data/gasBillRepo"; // Adjust path according to your structure

jest.mock("../data/gasBillRepo");

describe("gasBillService.getByITL3", () => {
  const mockGasPrice = 1200;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return gas bill for a valid ITL3", async () => {
    // Arrange
    const itl3 = "ITL3-123";
    (gasBillRepo.getGasPriceByITL3 as jest.Mock).mockResolvedValueOnce(
      mockGasPrice
    );

    // Act
    const result = await gasBillService.getByITL3(itl3);

    // Assert
    expect(gasBillRepo.getGasPriceByITL3).toHaveBeenCalledWith(itl3);
    expect(result).toBe(mockGasPrice);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch gas bill";
    (gasBillRepo.getGasPriceByITL3 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(gasBillService.getByITL3("ITL3-123")).rejects.toThrow(
      errorMessage
    );
  });
});
