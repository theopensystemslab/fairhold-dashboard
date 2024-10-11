import { buildPriceRepo } from "./buildPriceRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  buildPrices: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("buildPriceRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the build price for a valid house type", async () => {
    const houseType = "single-family";
    const mockBuildPrice = 300000;

    (prisma.buildPrices.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      priceMid: mockBuildPrice,
    });

    const result = await buildPriceRepo.getBuildPriceByHouseType(houseType);
    expect(result).toBe(mockBuildPrice);
    expect(prisma.buildPrices.findFirstOrThrow).toHaveBeenCalledWith({
      where: { houseType: { equals: houseType } },
      select: { priceMid: true },
    });
  });

  it("should throw an error when no price is found for the house type", async () => {
    const houseType = "non-existent-house-type";

    (prisma.buildPrices.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("No records found")
    );

    await expect(
      buildPriceRepo.getBuildPriceByHouseType(houseType)
    ).rejects.toThrow(
      `Data error: Unable to get buildPrice for houseType ${houseType}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const houseType = "single-family";

    (prisma.buildPrices.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(
      buildPriceRepo.getBuildPriceByHouseType(houseType)
    ).rejects.toThrow(
      `Data error: Unable to get buildPrice for houseType ${houseType}`
    );
  });
});
