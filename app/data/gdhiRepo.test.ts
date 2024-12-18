// __tests__/gdhiRepo.test.ts
import { gdhiRepo } from "./gdhiRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  gDHI: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("gdhiRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the GDHI value for a valid ITL3", async () => {
    const itl3 = "XYZ123456"; // Example ITL3
    const mockGDHI = 1000; // Example GDHI value

    // Mock the Prisma client response
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      gdhi: mockGDHI,
    });

    // Call the function
    const result = await gdhiRepo.getGDHIByITL3(itl3);

    // Assertions
    expect(result).toBe(mockGDHI);
    expect(prisma.gDHI.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        AND: {
          itl3: { equals: itl3 },
        },
      },
      select: { gdhi: true },
    });
  });

  it("should throw an error when no GDHI value is found for the ITL3", async () => {
    const itl3 = "non-existent-ITL3";

    // Mock rejection of the Prisma client
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("No records found")
    );

    // Call the function and expect an error
    await expect(gdhiRepo.getGDHIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find gdhi for itl3 ${itl3}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl3 = "XYZ123456";

    // Mock rejection of the Prisma client
    (prisma.gDHI.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    // Call the function and expect an error
    await expect(gdhiRepo.getGDHIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find gdhi for itl3 ${itl3}`
    );
  });
});
