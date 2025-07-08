import { gasPriceRepo } from "./gasPriceRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  gasPrice: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("gasPriceRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the gas price for a valid ITL", async () => {
    const itl = "12345XYZ"; // Example ITL
    const mockGasPrice = 8; // Example kwh_cost_pence amount

    (prisma.gasPrice.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      kwhCostPence: mockGasPrice,
    });

    const result = await gasPriceRepo.getGasPriceByITL3(itl);
    expect(result).toBe(mockGasPrice);
    expect(prisma.gasPrice.findFirstOrThrow).toHaveBeenCalledWith({
      where: { itl1: { startsWith: itl.substring(0, 3) } },
      select: { kwhCostPence: true },
    });
  });

  it("should throw an error when no bill is found for the ITL", async () => {
    const itl = "non-existent-ITL";

    (prisma.gasPrice.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("No records found")
    );

    await expect(gasPriceRepo.getGasPriceByITL3(itl)).rejects.toThrow(
      `Data error: Unable to find gas_price for itl3 ${itl}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl = "12345XYZ";

    (prisma.gasPrice.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(gasPriceRepo.getGasPriceByITL3(itl)).rejects.toThrow(
      `Data error: Unable to find gas_price for itl3 ${itl}`
    );
  });
});
