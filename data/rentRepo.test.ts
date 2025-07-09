import { rentRepo } from "./rentRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  rent: {
    findMany: jest.fn(),
  },
}));

describe("rentRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the average monthly mean rent for a valid ITL3", async () => {
    const itl3 = "TLI3";
    const mockMonthlyMeanRent = 1200;

    // Mock the Prisma client response
    (prisma.rent.findMany as jest.Mock).mockResolvedValueOnce([
      { monthlyMeanRent: 1100 },
      { monthlyMeanRent: 1300 }
    ]);

    const result = await rentRepo.getRentByITL3AndBedrooms(itl3, 2);

    expect(result).toBe(mockMonthlyMeanRent);
    expect(prisma.rent.findMany).toHaveBeenCalledWith({
      where: {
        itl3: itl3,
        bedrooms: 2
      },
    });
  });

  it("should throw an error when no monthly mean rent is found", async () => {
    const itl3 = "NON_EXISTENT_ITL3"; // Example non-existent ITL3

    // Mock the Prisma client response with null average
    (prisma.rent.findMany as jest.Mock).mockResolvedValueOnce([]);

    // Call the function and expect an error
    await expect(rentRepo.getRentByITL3AndBedrooms(itl3, 2)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });

  it("should throw an error for any other error", async () => {
    const itl3 = "TLI2";

    // Mock the Prisma client to throw an error
    (prisma.rent.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(rentRepo.getRentByITL3AndBedrooms(itl3, 4)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });
});
