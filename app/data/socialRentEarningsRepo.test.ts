// __tests__/socialRentEarningsRepo.test.ts
import { socialRentEarningsRepo } from "./socialRentEarningsRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  socialRent: {
    aggregate: jest.fn(), // Mock the aggregate method
  },
}));

describe("socialRentEarningsRepo", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return the average earnings per week for a valid ITL3", async () => {
    const itl3 = "XYZ123"; // Example ITL3
    const mockEarnings = 500; // Example average earnings

    // Mock the Prisma client response
    (prisma.socialRentEarnings.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { earningsPerWeek: mockEarnings },
    });

    const result =
      await socialRentEarningsRepo.getSocialRentEarningsByITL3(itl3);

    expect(result).toBe(mockEarnings);
    expect(prisma.socialRentEarnings.aggregate).toHaveBeenCalledWith({
      where: {
        itl3: {
          startsWith: itl3.substring(0, 3),
        },
      },
      _avg: {
        earningsPerWeek: true,
      },
    });
  });

  it("should throw an error when no average earnings per week are found", async () => {
    const itl3 = "XYZ123";

    // Mock the Prisma client response to return null for earningsPerWeek
    (prisma.socialRentEarnings.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { earningsPerWeek: null },
    });

    await expect(
      socialRentEarningsRepo.getSocialRentEarningsByITL3(itl3)
    ).rejects.toThrow(
      `Data error: Unable to find earningsPerWeek for itl3 ${itl3}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl3 = "XYZ123";

    // Mock the Prisma client to throw an error
    (prisma.socialRentEarnings.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(
      socialRentEarningsRepo.getSocialRentEarningsByITL3(itl3)
    ).rejects.toThrow(
      `Data error: Unable to find earningsPerWeek for itl3 ${itl3}`
    );
  });
});
