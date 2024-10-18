// __tests__/pricesPaidRepo.test.ts
import { pricesPaidRepo } from "./pricesPaidRepo"; // Adjust the import according to your file structure
import prisma from "./db"; // Your Prisma setup file

jest.mock("./db", () => ({
  pricesPaid: {
    aggregate: jest.fn(), // Mock the aggregate method
  },
}));

describe("pricesPaidRepo", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return prices paid data for valid sector", async () => {
    const postcodeDistrict = "SW1A"; // Example postcode district
    const postcodeArea = "SW1"; // Example postcode area
    const postcodeSector = "SW1A1"; // Example postcode sector
    const houseType = "Detached"; // Example house type

    // Mock the Prisma client response for sector
    (prisma.pricesPaid.aggregate as jest.Mock).mockResolvedValueOnce({
      _count: { id: 35 }, // Enough postcodes
      _avg: { price: 500000 }, // Average price
    });

    const result = await pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
      postcodeDistrict,
      postcodeArea,
      postcodeSector,
      houseType
    );

    expect(result).toEqual({
      averagePrice: 500000,
      numberOfTransactions: 35,
      granularityPostcode: postcodeSector,
    });
  });

  it("should return prices paid data for valid district when sector count is below minimum", async () => {
    const postcodeDistrict = "SW1A"; // Example postcode district
    const postcodeArea = "SW1"; // Example postcode area
    const postcodeSector = "SW1A1"; // Example postcode sector
    const houseType = "Detached"; // Example house type

    // Mock the Prisma client response for sector (below minimum)
    (prisma.pricesPaid.aggregate as jest.Mock)
      .mockResolvedValueOnce({
        _count: { id: 25 }, // Below minimum
        _avg: { price: 500000 },
      })
      .mockResolvedValueOnce({
        _count: { id: 35 }, // Enough postcodes for district
        _avg: { price: 600000 },
      });

    const result = await pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
      postcodeDistrict,
      postcodeArea,
      postcodeSector,
      houseType
    );

    expect(result).toEqual({
      averagePrice: 600000,
      numberOfTransactions: 35,
      granularityPostcode: postcodeDistrict,
    });
  });

  it("should return prices paid data for valid area when district count is below minimum", async () => {
    const postcodeDistrict = "SW1A"; // Example postcode district
    const postcodeArea = "SW1"; // Example postcode area
    const postcodeSector = "SW1A1"; // Example postcode sector
    const houseType = "Detached"; // Example house type

    // Mock the Prisma client response for sector (below minimum)
    (prisma.pricesPaid.aggregate as jest.Mock)
      .mockResolvedValueOnce({
        _count: { id: 25 }, // Below minimum
        _avg: { price: 500000 },
      })
      .mockResolvedValueOnce({
        _count: { id: 20 }, // Below minimum for district
        _avg: { price: 600000 },
      })
      .mockResolvedValueOnce({
        _count: { id: 40 }, // Enough postcodes for area
        _avg: { price: 700000 },
      });

    const result = await pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
      postcodeDistrict,
      postcodeArea,
      postcodeSector,
      houseType
    );

    expect(result).toEqual({
      averagePrice: 700000,
      numberOfTransactions: 40,
      granularityPostcode: postcodeArea,
    });
  });

  it("should throw an error when average price is null", async () => {
    const postcodeDistrict = "SW1A"; // Example postcode district
    const postcodeArea = "SW1"; // Example postcode area
    const postcodeSector = "SW1A1"; // Example postcode sector
    const houseType = "Detached"; // Example house type

    // Mock the Prisma client response for sector (below minimum)
    (prisma.pricesPaid.aggregate as jest.Mock).mockResolvedValueOnce({
      _count: { id: 35 }, // Enough postcodes
      _avg: { price: null }, // Null average price
    });

    await expect(
      pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
        postcodeDistrict,
        postcodeArea,
        postcodeSector,
        houseType
      )
    ).rejects.toThrow(
      `Data error: Unable to get pricesPaid for postcode district ${postcodeDistrict} and houseType ${houseType}`
    );
  });

  it("should throw an error for any other error", async () => {
    const postcodeDistrict = "SW1A"; // Example postcode district
    const postcodeArea = "SW1"; // Example postcode area
    const postcodeSector = "SW1A1"; // Example postcode sector
    const houseType = "Detached"; // Example house type

    // Mock the Prisma client to throw an error
    (prisma.pricesPaid.aggregate as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(
      pricesPaidRepo.getPricesPaidByPostcodeAndHouseType(
        postcodeDistrict,
        postcodeArea,
        postcodeSector,
        houseType
      )
    ).rejects.toThrow(
      `Data error: Unable to get pricesPaid for postcode district ${postcodeDistrict} and houseType ${houseType}`
    );
  });
});
