import { itlRepo } from "./itlRepo"; // Update the import path as necessary
import prisma from "./db"; // Ensure this is the correct path for your Prisma client

jest.mock("./db", () => ({
  itlLookup: {
    findFirstOrThrow: jest.fn(),
  },
}));

describe("itlRepo", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return the ITL3 for a given postcode district", async () => {
    const postcodeDistrict = "SW1A";
    const expectedItl3 = "ITL3-Example";

    // Mock the Prisma client response
    (prisma.itlLookup.findFirstOrThrow as jest.Mock).mockResolvedValueOnce({
      itl3: expectedItl3,
    });

    const result = await itlRepo.getItl3ByPostcodeDistrict(postcodeDistrict);

    expect(result).toBe(expectedItl3);
    expect(prisma.itlLookup.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        postcode: postcodeDistrict,
      },
      select: {
        itl3: true,
      },
    });
  });

  it("should throw an error when no ITL3 value is found for the postcode district", async () => {
    const postcodeDistrict = "UNKNOWN_POSTCODE";

    // Mock the Prisma client to throw an error
    (prisma.itlLookup.findFirstOrThrow as jest.Mock).mockRejectedValueOnce(
      new Error("Not Found")
    );

    // Call the function and expect an error
    await expect(
      itlRepo.getItl3ByPostcodeDistrict(postcodeDistrict)
    ).rejects.toThrow(
      `Data error: Unable get get itl3 for postcode district ${postcodeDistrict}`
    );
  });
});
