// __tests__/hpiService.test.ts
import { hpiService } from "../services/hpiService"; // Adjust the path according to your structure
import { hpi2020Repo } from "../data/hpiRepo"; // Adjust the path according to your structure

jest.mock("../data/hpiRepo");

describe("hpiService.getByITL3", () => {
  const mockHPI = 1.05;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return HPI for a valid ITL3", async () => {
    // Arrange
    const itl3 = "ITL3-123";
    (hpi2020Repo.getHPIByITL3 as jest.Mock).mockResolvedValueOnce(mockHPI);

    // Act
    const result = await hpiService.getByITL3(itl3);

    // Assert
    expect(hpi2020Repo.getHPIByITL3).toHaveBeenCalledWith(itl3);
    expect(result).toBe(mockHPI);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch HPI";
    (hpi2020Repo.getHPIByITL3 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(hpiService.getByITL3("ITL3-123")).rejects.toThrow(
      errorMessage
    );
  });
});
