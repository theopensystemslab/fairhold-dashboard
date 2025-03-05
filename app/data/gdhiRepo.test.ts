import { gdhiRepo } from "./gdhiRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  gDHI: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("gdhiRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the GDHI value for a valid ITL1", async () => {
    const itl1 = "TLH";
    const mockGDHI = 28000;

    // Mock the Prisma client response
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      gdhi: mockGDHI,
    });

    // Call the function
    const result = await gdhiRepo.getGDHIByITL1(itl1);

    // Assertions
    expect(result).toBe(mockGDHI);
    expect(prisma.gDHI.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        AND: {
          itl1: { equals: itl1 },
        },
      },
      select: { gdhi: true },
    });
  });

  it("should throw an error when no GDHI value is found for the ITL1", async () => {
    const itl1 = "non-existent-ITL1";

    // Mock rejection of the Prisma client
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("No records found")
    );

    // Call the function and expect an error
    await expect(gdhiRepo.getGDHIByITL1(itl1)).rejects.toThrow(
      `Data error: Unable to find gdhi for itl1 ${itl1}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl1 = "TLH";

    // Mock rejection of the Prisma client
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    // Call the function and expect an error
    await expect(gdhiRepo.getGDHIByITL1(itl1)).rejects.toThrow(
      `Data error: Unable to find gdhi for itl1 ${itl1}`
    );
  });
});
