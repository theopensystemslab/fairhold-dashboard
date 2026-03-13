import { rentService } from "./rentService";
import { rentRepo } from "../data/rentRepo";
import { RentData } from "../data/rentRepo";

jest.mock("../data/rentRepo");

describe("rentService.getByITL3BedroomsAndType", () => {
  const mockRentData: RentData = {
    averageRent: 566,
    bedroomRent: 515,
    houseTypeRent: 816,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return rent data for a valid ITL3 code, house type and bedrooms", async () => {
    (rentRepo.getRentByITL3BedroomsAndType as jest.Mock).mockResolvedValueOnce(mockRentData);

    const result = await rentService.getByITL3BedroomsAndType("ITL3-123", "D", 2);

    expect(rentRepo.getRentByITL3BedroomsAndType).toHaveBeenCalledWith("ITL3-123", "D", 2);
    expect(result).toEqual(mockRentData);
  });

  it("should throw an error when the repo fails", async () => {
    const errorMessage = "Failed to fetch rent data";
    (rentRepo.getRentByITL3BedroomsAndType as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(
      rentService.getByITL3BedroomsAndType("ITL3", "D", 2)
    ).rejects.toThrow(errorMessage);
  });
});