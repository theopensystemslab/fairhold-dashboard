import { rentRepo } from "./rentRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  rent: {
    aggregate: jest.fn(),
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
    (prisma.rent.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { monthlyMeanRent: mockMonthlyMeanRent },
    });

    const result = await rentRepo.getRentByITL3AndBedrooms(itl3, 2);

    expect(result).toBe(mockMonthlyMeanRent);
    expect(prisma.rent.aggregate).toHaveBeenCalledWith({
      where: {
        itl3: { equals: itl3 },
        bedrooms: { equals: 2}
      },
      _avg: {
        monthlyMeanRent: true,
      },
    });
  });

  it("should throw an error when no monthly mean rent is found", async () => {
    const itl3 = "NON_EXISTENT_ITL3"; // Example non-existent ITL3

    // Mock the Prisma client response with null average
    (prisma.rent.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { monthlyMeanRent: null },
    });

    // Call the function and expect an error
    await expect(rentRepo.getRentByITL3AndBedrooms(itl3, 2)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });

  it("should throw an error for any other error", async () => {
    const itl3 = "TLI2";

    // Mock the Prisma client to throw an error
    (prisma.rent.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(rentRepo.getRentByITL3AndBedrooms(itl3, 4)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });
});
