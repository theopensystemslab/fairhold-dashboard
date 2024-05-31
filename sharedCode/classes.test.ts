import { Mortgage, Fairhold, Property, Household } from "./classes";

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
    const fairhold = new Fairhold({
      affordability: 0.05,
      originalPrice: 100,
    });
    expect(fairhold).toBeDefined();
  });

  it("correctly calculates the fairhold formula below the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.1,
      originalPrice: 100,
    });
    expect(fairhold.discount).toBeCloseTo(0.65);
  });

  it("correctly calculates the fairhold formula above the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.9,
      originalPrice: 100,
      plateau: 3,
    });
    expect(fairhold.discount).toBeCloseTo(3);
  });
});

// unit test for the Property class
describe("Property class", () => {
  it("can be instantiated", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 1,
      averagePrice: 120,
      itl3: "TLG24",
    });
  });

  it("correctly calculates the newBuildPrice", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.newBuildPrice).toBeCloseTo(186560);
  });

  it("correctly calculates the depreciatedBuildPrice", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.depreciatedBuildPrice).toBeCloseTo(110717.45);
  });

  it("correctly calculates the bedWeightedAveragePrice", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.bedWeightedAveragePrice).toBeCloseTo(218091.58);
  });

  it("correctly calculates the landPrice", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.landPrice).toBeCloseTo(31531.579);
  });

  it("correctly calculates the landToTotalRatio", () => {
    const property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });
    expect(property.landToTotalRatio).toBeCloseTo(0.14);
  });
});

// Unit test for the Household class
describe("Household class", () => {
  it("can be instantiated", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household).toBeDefined();
  });

  it("correctly calculates the income per household", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.income).toBeCloseTo(240);
  });

  it("correctly calculates the socialRent", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.socialRent).toBeCloseTo(240);
  });

  it("correctly calculates the mortgageAffordability", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.mortgageAffordability).toBeCloseTo(100);
  });

  it("correctly calculates the socialRentMonthlyHouse", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.socialRentMonthlyHouse).toBeCloseTo(100);
  });

  it("correctly calculates the socialRentMonthlyLand", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.socialRentMonthlyLand).toBeCloseTo(100);
  });

  it("correctly calculates the rentAffordability", () => {
    const property = new Property({
      postcode: "SPE A11",
      houseType: "D",
      numberOfBedrooms: 2,
      age: 2,
      size: 90,
      newBuildPricePerMetre: 100,
      averagePrice: 100000,
      itl3: "TLI44",
    });

    const rentAdjustements = [
      { id: 1, inflation: 2, total: 3, year: "2001-02" },
      { id: 2, inflation: 3, total: 4, year: "2002-03" },
    ];
    const household = new Household({
      incomePerPerson: 100,
      averageRent: 300,
      averageSocialRent: 200,
      rentAdjustements: rentAdjustements,
      housePriceIndex: 1,
      property: property,
    });
    expect(household.rentAffordability).toBeCloseTo(100);
  });
});
