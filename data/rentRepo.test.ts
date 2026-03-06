import { rentRepo } from "./rentRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  rent: {
    findFirst: jest.fn(),
  },
}));

const mockRentRow = {
  id: 1,
  itl3: "TLI3",
  ladCode: "E06000001",
  areaName: "Hartlepool",
  averageRent: 566,
  rent1br: 407,
  rent2br: 515,
  rent3br: 615,
  rent4plusbr: 822,
  rentDetached: 816,
  rentSemidetached: 628,
  rentTerraced: 559,
  rentFlatMaisonette: 490,
};

describe("rentRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return rent data for a valid ITL3, house type and bedrooms", async () => {
    (prisma.rent.findFirst as jest.Mock).mockResolvedValueOnce(mockRentRow);

    const result = await rentRepo.getRentByITL3BedroomsAndType("TLI3", "D", 2);

    expect(result).toEqual({
      averageRent: 566,
      bedroomRent: 515,
      houseTypeRent: 816,
    });
    expect(prisma.rent.findFirst).toHaveBeenCalledWith({
      where: { itl3: "TLI3" },
    });
  });

  it("should clamp bedrooms to 1 when given a value below 1", async () => {
    (prisma.rent.findFirst as jest.Mock).mockResolvedValueOnce(mockRentRow);

    const result = await rentRepo.getRentByITL3BedroomsAndType("TLI3", "S", 0);

    expect(result).toEqual({
      averageRent: 566,
      bedroomRent: 407,
      houseTypeRent: 628,
    });
  });

  it("should clamp bedrooms to 4 when given a value above 4", async () => {
    (prisma.rent.findFirst as jest.Mock).mockResolvedValueOnce(mockRentRow);

    const result = await rentRepo.getRentByITL3BedroomsAndType("TLI3", "T", 6);

    expect(result).toEqual({
      averageRent: 566,
      bedroomRent: 822,
      houseTypeRent: 559,
    });
  });

  it("should throw an error when no rent data is found", async () => {
    (prisma.rent.findFirst as jest.Mock).mockResolvedValueOnce(null);

    await expect(rentRepo.getRentByITL3BedroomsAndType("NON_EXISTENT", "F", 2)).rejects.toThrow(
      "Data error: Unable to find rent for itl3 NON_EXISTENT"
    );
  });

  it("should throw an error for a database error", async () => {
    (prisma.rent.findFirst as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(rentRepo.getRentByITL3BedroomsAndType("TLI3", "D", 2)).rejects.toThrow(
      "Data error: Unable to find rent for itl3 TLI3"
    );
  });
});