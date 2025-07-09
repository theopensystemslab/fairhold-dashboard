import { hpi1999Repo } from "./hpiRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  hPI: {
    aggregate: jest.fn(),
  },
}));

describe("hpi1999Repo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the average HPI value for a valid ITL3", async () => {
    const itl3 = "XYZ123456"; // Example ITL3
    const mockAverageHpi = 150.5; // Example average HPI value

    // Mock the Prisma client response
    (prisma.hPI.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { hpi1999: mockAverageHpi },
    });

    // Call the function
    const result = await hpi1999Repo.getHPIByITL3(itl3);

    // Assertions
    expect(result).toBe(mockAverageHpi);
    expect(prisma.hPI.aggregate).toHaveBeenCalledWith({
      where: {
        itl3: {
          endsWith: itl3,
        },
      },
      _avg: {
        hpi1999: true,
      },
    });
  });

  it("should throw an error when no HPI value is found for the ITL3", async () => {
    const itl3 = "non-existent-ITL3";

    // Mock rejection of the Prisma client
    (prisma.hPI.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { hpi1999: null },
    });

    // Call the function and expect an error
    await expect(hpi1999Repo.getHPIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find hpi1999 for itl3 ${itl3}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl3 = "XYZ123456";

    // Mock rejection of the Prisma client
    (prisma.hPI.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    // Call the function and expect an error
    await expect(hpi1999Repo.getHPIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find hpi1999 for itl3 ${itl3}`
    );
  });
});
