// __tests__/gdhiService.test.ts
import { gdhiService } from "./gdhiService"; // Adjust the path according to your structure
import { gdhiRepo } from "../data/gdhiRepo"; // Adjust the path according to your structure

jest.mock("../data/gdhiRepo");

describe("gdhiService.getByITL1", () => {
  const mockGDHI = 35000;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return GDHI for a valid ITL1", async () => {
    // Arrange
    const itl1 = "TLH";
    (gdhiRepo.getGDHIByITL1 as jest.Mock).mockResolvedValueOnce(mockGDHI);

    // Act
    const result = await gdhiService.getByITL1(itl1);

    // Assert
    expect(gdhiRepo.getGDHIByITL1).toHaveBeenCalledWith(itl1);
    expect(result).toBe(mockGDHI);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch GDHI";
    (gdhiRepo.getGDHIByITL1 as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(gdhiService.getByITL1("TLG")).rejects.toThrow(
      errorMessage
    );
  });
});
