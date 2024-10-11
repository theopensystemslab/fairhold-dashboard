// __tests__/hpiRepo.test.ts
import { hpi2000Repo } from "./hpiRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  hPI: {
    aggregate: jest.fn(),
  },
}));

describe("hpi2000Repo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the average HPI value for a valid ITL3", async () => {
    const itl3 = "XYZ123456"; // Example ITL3
    const mockAverageHpi = 150.5; // Example average HPI value

    // Mock the Prisma client response
    (prisma.hPI.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { hpi2000: mockAverageHpi },
    });

    // Call the function
    const result = await hpi2000Repo.getHPIByITL3(itl3);

    // Assertions
    expect(result).toBe(mockAverageHpi);
    expect(prisma.hPI.aggregate).toHaveBeenCalledWith({
      where: {
        itl3: {
          endsWith: itl3,
        },
      },
      _avg: {
        hpi2000: true,
      },
    });
  });

  it("should throw an error when no HPI value is found for the ITL3", async () => {
    const itl3 = "non-existent-ITL3";

    // Mock rejection of the Prisma client
    (prisma.hPI.aggregate as jest.Mock).mockResolvedValueOnce({
      _avg: { hpi2000: null },
    });

    // Call the function and expect an error
    await expect(hpi2000Repo.getHPIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find hpi2000 for itl3 ${itl3}`
    );
  });

  it("should throw an error when there is a database error", async () => {
    const itl3 = "XYZ123456";

    // Mock rejection of the Prisma client
    (prisma.hPI.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    // Call the function and expect an error
    await expect(hpi2000Repo.getHPIByITL3(itl3)).rejects.toThrow(
      `Data error: Unable to find hpi2000 for itl3 ${itl3}`
    );
  });
});
