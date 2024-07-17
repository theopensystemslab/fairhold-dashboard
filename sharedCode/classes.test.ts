import { Mortgage, FairholdLandPurchase, Property, Household } from "./classes";

// Unit test for the mortgage class
describe("Mortgage class", () => {
  it("can be instantiated", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });
    expect(mortgage).toBeDefined();
  });

  it("correctly calculates the amount of the mortgage ", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });

    expect(mortgage.amountOfTheMortgage).toBeCloseTo(90);
  });

  it("correctly calculates the amount of monthly payment ", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });
    expect(mortgage.monthlyPayment).toBeCloseTo(0.53);
  });
});

// Unit test for the Fairhold class
describe("Fairhold class", () => {
  it("can be instantiated", () => {
    const fairhold = new FairholdLandPurchase({
      affordability: 0.05,
      originalLandPrice: 100,
      housePrice: 200,
    });
    expect(fairhold).toBeDefined();
  });

  it("correctly calculates the fairhold formula below the threshold", () => {
    const fairhold = new FairholdLandPurchase({
      affordability: 0.1,
      originalLandPrice: 100,
      housePrice: 200,
    });
    expect(fairhold.discountLand).toBeCloseTo(0.65);
  });

  it("correctly calculates the fairhold formula above the threshold", () => {
    const fairhold = new FairholdLandPurchase({
      affordability: 0.9,
      originalLandPrice: 100,
      housePrice: 200,
      plateau: 3,
    });
    expect(fairhold.discountLand).toBeCloseTo(3);
  });
});

// unit test for the Property class
describe("Property class", () => {
  let property: Property;

  beforeEach(() => {
    property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
  });

  it("can be instantiated", () => {
    expect(property).toBeInstanceOf(Property);
  });

  it("correctly calculates the newBuildPrice", () => {
    expect(property.newBuildPrice).toBeCloseTo(186560);
  });

  it("correctly calculates the depreciatedBuildPrice", () => {
    expect(property.depreciatedBuildPrice).toBeCloseTo(110717.45);
  });

  it("correctly calculates the bedWeightedAveragePrice", () => {
    expect(property.bedWeightedAveragePrice).toBeCloseTo(218091.58);
  });

  it("correctly calculates the landPrice", () => {
    expect(property.landPrice).toBeCloseTo(31531.579);
  });

  it("correctly calculates the landToTotalRatio", () => {
    expect(property.landToTotalRatio).toBeCloseTo(0.14);
  });
});

// Unit test for the Household class
describe("Household class", () => {
  let property: Property;
  let household: Household;
  const socialRentAdjustments = [
    { id: 1, inflation: 3.3, total: 4.3, year: "2001-02" },
    { id: 2, inflation: 1.7, total: 2.2, year: "2002-03" },
    { id: 3, inflation: 1.7, total: 2.2, year: "2003-04" },
    { id: 4, inflation: 2.8, total: 3.3, year: "2004-05" },
    { id: 5, inflation: 3.1, total: 3.6, year: "2005-06" },
    { id: 6, inflation: 2.7, total: 3.2, year: "2006-07" },
    { id: 7, inflation: 3.6, total: 4.1, year: "2007-08" },
    { id: 8, inflation: 3.9, total: 4.4, year: "2008-09" },
    { id: 9, inflation: 5.0, total: 5.5, year: "2009-10" },
    { id: 10, inflation: -1.4, total: -0.9, year: "2010-11" },
    { id: 11, inflation: 4.6, total: 5.1, year: "2011-12" },
    { id: 12, inflation: 5.6, total: 6.1, year: "2012-13" },
    { id: 13, inflation: 2.6, total: 3.1, year: "2013-14" },
    { id: 14, inflation: 3.2, total: 3.7, year: "2014-15" },
    { id: 15, inflation: 1.2, total: 2.2, year: "2015-16" },
    { id: 16, inflation: NaN, total: -1.0, year: "2016-17" },
    { id: 17, inflation: NaN, total: -1.0, year: "2017-18" },
    { id: 18, inflation: NaN, total: -1.0, year: "2018-19" },
    { id: 19, inflation: NaN, total: -1.0, year: "2019-20" },
    { id: 20, inflation: 1.7, total: 2.7, year: "2020-21" },
    { id: 21, inflation: 0.5, total: 1.5, year: "2021-22" },
    { id: 22, inflation: 3.1, total: 4.1, year: "2022-23" },
    { id: 23, inflation: 10.1, total: 11.1, year: "2023-24" },
  ];

  beforeEach(() => {
    property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    household = new Household({
      incomePerPerson: 19090.0,
      averageRent: 773.875,
      socialRentAveEarning: 295.4,
      socialRentAdjustments: socialRentAdjustments,
      housePriceIndex: 75434.35,
      gasBillYearly: 800,
      property: property,
    });
  });

  it("can be instantiated", () => {
    expect(household).toBeInstanceOf(Household);
  });

  it("correctly calculates the income per household", () => {
    expect(household.income).toBeCloseTo(45816);
  });

  it("correctly calculates the relativeLocalEarning", () => {
    expect(household.relativeLocalEarning).toBeCloseTo(0.9336);
  });

  it("correctly calculates the relativePropertyValue", () => {
    expect(household.relativePropertyValue).toBeCloseTo(1.516);
  });

  it("correctly calculates the adjusted formula rent weekly", () => {
    expect(household.formulaRentWeekly).toBeCloseTo(60.54);
  });

  it("correctly calculates the adjusted monthly socialRent", () => {
    expect(household.adjustedSocialRentMonthly).toBeCloseTo(424.12);
  });

  it("correctly calculates the mortgageMarket?.monthlyPayment", () => {
    expect(household.mortgageMarket?.monthlyPayment).toBeCloseTo(1111.43);
  });

  it("correctly calculates the mortgageMarketAffordability", () => {
    expect(household.mortgageMarketAffordability).toBeCloseTo(0.29);
  });

  it("correctly calculates the socialRentMonthlyHouse", () => {
    expect(household.socialRentMonthlyHouse).toBeCloseTo(362.8);
  });

  it("correctly calculates the socialRentMonthlyLand", () => {
    expect(household.socialRentMonthlyLand).toBeCloseTo(61.32);
  });

  it("correctly calculates the rentAffordability", () => {
    expect(household.rentAffordability).toBeCloseTo(0.2);
  });

  it("correctly calculates the fairholdLandPurchase.discountLand", () => {
    expect(household.fairholdLandPurchase?.discountLand).toBeCloseTo(0.386);
  });
});
