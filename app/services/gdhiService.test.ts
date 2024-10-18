// __tests__/gdhiService.test.ts
import { gdhiService } from "../services/gdhiService"; // Adjust the path according to your structure
import { gdhiRepo } from "../data/gdhiRepo"; // Adjust the path according to your structure

jest.mock("../data/gdhiRepo");

describe("gdhiService.getByITL3", () => {
  const mockGDHI = 35000;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return GDHI for a valid ITL3", async () => {
    // Arrange
    const itl3 = "ITL3-123";
    (gdhiRepo.getGDHI2020ByITL3 as jest.Mock).mockResolvedValueOnce(mockGDHI);

    // Act
    const result = await gdhiService.getByITL3(itl3);

    // Assert
    expect(gdhiRepo.getGDHI2020ByITL3).toHaveBeenCalledWith(itl3);
    expect(result).toBe(mockGDHI);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch GDHI";
    (gdhiRepo.getGDHI2020ByITL3 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(gdhiService.getByITL3("ITL3-123")).rejects.toThrow(
      errorMessage
    );
  });
});
