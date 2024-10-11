// __tests__/socialRentAdjustmentsService.test.ts
import { socialRentAdjustmentsService } from "../services/socialRentAdjustmentsService"; // Adjust the path according to your structure
import { socialRentAdjustmentsRepo } from "../data/socialRentAdjustmentsRepo"; // Adjust the path according to your structure

jest.mock("../data/socialRentAdjustmentsRepo");

describe("socialRentAdjustmentsService.getAdjustments", () => {
  const mockAdjustmentsData = [
    { year: "2022", inflation: 2, additional: 3, total: 5 },
    { year: "2023", inflation: 2.5, additional: 3.5, total: 6 },
  ]; // Mock social rent adjustments data

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return social rent adjustments data", async () => {
    // Arrange
    (
      socialRentAdjustmentsRepo.getSocialRentAdjustments as jest.Mock
    ).mockResolvedValueOnce(mockAdjustmentsData);

    // Act
    const result = await socialRentAdjustmentsService.getAdjustments();

    // Assert
    expect(
      socialRentAdjustmentsRepo.getSocialRentAdjustments
    ).toHaveBeenCalled();
    expect(result).toEqual(mockAdjustmentsData);
  });

  it("should throw an error when the repo fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch social rent adjustments";
    (
      socialRentAdjustmentsRepo.getSocialRentAdjustments as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(socialRentAdjustmentsService.getAdjustments()).rejects.toThrow(
      errorMessage
    );
  });
});
