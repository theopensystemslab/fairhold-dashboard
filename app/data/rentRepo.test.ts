// __tests__/rentRepo.test.ts
import { rentRepo } from "./rentRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  rent: {
    aggregate: jest.fn(), // Mock the aggregate method
  },
}));

describe("rentRepo", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return the average monthly mean rent for a valid ITL3", async () => {
    const itl3 = "XYZ123456"; // Example ITL3
    const mockMonthlyMeanRent = 1200; // Example rent value

    // Mock the Prisma client response
    (prisma.rent.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { monthlyMeanRent: mockMonthlyMeanRent },
    });

    const result = await rentRepo.getRentByITL3(itl3);

    expect(result).toBe(mockMonthlyMeanRent);
    expect(prisma.rent.aggregate).toHaveBeenCalledWith({
      where: {
        itl3: { equals: itl3 },
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
    await expect(rentRepo.getRentByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });

  it("should throw an error for any other error", async () => {
    const itl3 = "XYZ123456"; // Example ITL3

    // Mock the Prisma client to throw an error
    (prisma.rent.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(rentRepo.getRentByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find monthlyMeanRent for itl3 ${itl3}`
    );
  });
});
