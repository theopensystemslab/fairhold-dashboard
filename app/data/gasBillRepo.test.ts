// __tests__/gasBillRepo.test.ts
import { gasBillRepo } from "./gasBillRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  gasBills: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("gasBillRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the gas bill for a valid ITL", async () => {
    const itl = "12345XYZ"; // Example ITL
    const mockGasBill = 150; // Example gas bill amount

    (prisma.gasBills.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      kwhCostPence: mockGasBill,
    });

    const result = await gasBillRepo.getGasBillByITL3(itl);
    expect(result).toBe(mockGasBill);
    expect(prisma.gasBills.findFirstOrThrow).toHaveBeenCalledWith({
      where: { itl1: { startsWith: itl.substring(0, 3) } },
      select: { kwhCostPence: true },
    });
  });

  it("should throw an error when no bill is found for the ITL", async () => {
    const itl = "non-existent-ITL";

    (prisma.gasBills.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("No records found")
    );

    await expect(gasBillRepo.getGasBillByITL3(itl)).rejects.toThrow(
      `Data error: Unable to find gas_bills_2020 for itl3 ${itl}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl = "12345XYZ";

    (prisma.gasBills.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(gasBillRepo.getGasBillByITL3(itl)).rejects.toThrow(
      `Data error: Unable to find gas_bills_2020 for itl3 ${itl}`
    );
  });
});
