import { pricesPaidRepo } from "./pricesPaidRepo";
import prisma from "./db";

jest.mock("./db", () => ({
  pricesPaidSummaryFiltered: {
    findFirst: jest.fn(),
  },
}));

const postcodeDistrict = "SW1A";
const postcodeArea = "SW1";
const postcodeSector = "SW1A1";
const houseType = "Detached";

describe("pricesPaidRepo", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should return prices paid data", async () => {   
    (prisma.pricesPaidSummaryFiltered.findFirst as jest.Mock).mockResolvedValueOnce({
      averagePrice: 500000,
      transactionCount: 35,
      postcode: postcodeSector,
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

  it("should throw an error if no transaction data is found", async () => {
    (prisma.pricesPaidSummaryFiltered.findFirst as jest.Mock).mockResolvedValueOnce(null);

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
    (prisma.pricesPaidSummaryFiltered.findFirst as jest.Mock).mockRejectedValueOnce(
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
