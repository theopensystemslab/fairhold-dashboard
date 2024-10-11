// __tests__/socialRentAdjustmentsRepo.test.ts
import { socialRentAdjustmentsRepo } from "./socialRentAdjustmentsRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  socialRentAdjustments: {
    findMany: jest.fn(), // Mock the findMany method
  },
}));

describe("socialRentAdjustmentsRepo", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return social rent adjustments for valid data", async () => {
    const mockData = [
      { year: "2021", inflation: 1.5, additional: 2.0, total: 3.5 },
      { year: "2022", inflation: 2.0, additional: 2.5, total: 4.5 },
    ];

    // Mock the Prisma client response
    (prisma.socialRentAdjustments.findMany as jest.Mock).mockResolvedValueOnce(
      mockData
    );

    const result = await socialRentAdjustmentsRepo.getSocialRentAdjustments();

    expect(result).toEqual(mockData);
    expect(prisma.socialRentAdjustments.findMany).toHaveBeenCalledWith({
      select: {
        year: true,
        inflation: true,
        additional: true,
        total: true,
      },
    });
  });

  it("should throw an error if any fields are null", async () => {
    const mockDataWithNull = [
      { year: null, inflation: 1.5, additional: 2.0, total: 3.5 },
    ];

    // Mock the Prisma client response
    (prisma.socialRentAdjustments.findMany as jest.Mock).mockResolvedValueOnce(
      mockDataWithNull
    );

    // Call the function and expect an error
    await expect(
      socialRentAdjustmentsRepo.getSocialRentAdjustments()
    ).rejects.toThrow(`Data error: unable to find socialRentAdjustments`);
  });

  it("should throw an error when there is a database error", async () => {
    // Mock the Prisma client to throw an error
    (prisma.socialRentAdjustments.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(
      socialRentAdjustmentsRepo.getSocialRentAdjustments()
    ).rejects.toThrow(`Data error: unable to find socialRentAdjustments`);
  });
});
