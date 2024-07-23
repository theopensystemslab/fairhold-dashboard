import {
  Mortgage,
  Fairhold,
  Property,
  Household,
  FairholdLandPurchase,
  MarketPurchase,
  MarketRent,
  SocialRent,
  FairholdLandRent,
} from "./classes";

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
      landPriceOrRent: 100,
    });
    expect(fairhold).toBeDefined();
  });

  it("correctly calculates the fairhold formula below the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.05,
      landPriceOrRent: 100,
    });
    expect(fairhold.discountLand).toBeCloseTo(0.6877641290737884);
  });

  it("correctly calculates the fairhold formula above the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.05,
      landPriceOrRent: 100,
      plateau: 3,
    });
    expect(fairhold.discountLand).toBeCloseTo(0.68776);
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

// Unit test for the tenureMarketPurchase
describe("tenureMarketPurchase class", () => {
  let tenureMarketPurchase: MarketPurchase;

  beforeEach(() => {
    let forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    };

    let property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    tenureMarketPurchase = new MarketPurchase({
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
    });
  });

  it("can be instantiated", () => {
    expect(tenureMarketPurchase).toBeInstanceOf(MarketPurchase);
  });
});

// Unit test for the TenureMarketRent
describe("TenureMarketRent class", () => {
  let tenureMarketRent: MarketRent;

  beforeEach(() => {
    let forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    };

    let property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    tenureMarketRent = new MarketRent({
      averageRentYearly: 20000,
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
      rentGrowthPerYear: forecastParameters.rentGrowthPerYear,
    });
  });

  it("can be instantiated", () => {
    expect(tenureMarketRent).toBeInstanceOf(MarketRent);
  });
});

// Unit test for the TenureFairholdLandRent
describe("TenureFairholdLandRent class", () => {
  let tenureFairholdLandRent: FairholdLandRent;

  beforeEach(() => {
    let forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    };

    let property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    let tenureMarketRent = new MarketRent({
      averageRentYearly: 20000,
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
      rentGrowthPerYear: forecastParameters.rentGrowthPerYear,
    });

    tenureFairholdLandRent = new FairholdLandRent({
      averageRentYearly: 20000,
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
      rentGrowthPerYear: forecastParameters.rentGrowthPerYear,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      fairhold: new Fairhold({
        affordability: 0.2,
        landPriceOrRent: 20000,
      }),
    });
  });

  it("can be instantiated", () => {
    expect(tenureFairholdLandRent).toBeInstanceOf(FairholdLandRent);
  });
});

// Unit test for the TenureFairholdLandRent
describe("TenureFairholdLandPurchase class", () => {
  let tenureFairholdLandPurchase: FairholdLandPurchase;

  beforeEach(() => {
    let forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    };

    let property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    let tenureMarketPurchase = new MarketPurchase({
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
    });

    tenureFairholdLandPurchase = new FairholdLandPurchase({
      incomeYearly: 45816,
      averagePrice: 218091.58,
      newBuildPrice: 186560,
      depreciatedBuildPrice: 110717.45,
      landPrice: 31531.579,
      maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: forecastParameters.incomeGrowthPerYear,
      propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: forecastParameters.yearsForecast,
      affordabilityThresholdIncomePercentage:
        forecastParameters.affordabilityThresholdIncomePercentage,
      affordability: 0.2,
      fairhold: new Fairhold({
        affordability: 0.2,
        landPriceOrRent: 31531.579,
      }),
    });
  });

  it("can be instantiated", () => {
    expect(tenureFairholdLandPurchase).toBeInstanceOf(FairholdLandPurchase);
  });
});

// Unit test for the TenureSocialRent
describe("TenureSocialRent class", () => {
  let tenureSocialRent: SocialRent;

  beforeEach(() => {
    let forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    };

    let property = new Property({
      postcode: "WV8 1HG",
      houseType: "T",
      numberOfBedrooms: 2,
      age: 10,
      size: 88,
      newBuildPricePerMetre: 2120,
      averagePrice: 218091.58,
      itl3: "TLG24",
    });

    let socialRentAdjustments = [
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

    tenureSocialRent = new SocialRent({
      socialRentAverageEarning: 295.4,
      socialRentAdjustments: socialRentAdjustments,
      housePriceIndex: 75434.35,
      property: property,
    });
  });
  it("can be instantiated", () => {
    expect(tenureSocialRent).toBeInstanceOf(SocialRent);
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

  const forecastParameters = {
    maintenanceCostPercentage: 0.0125, // percentage maintenance cost
    incomeGrowthPerYear: 0.04, // 4% income growth per year
    constructionPriceGrowthPerYear: 0.025, // 2.5%
    rentGrowthPerYear: 0.03, // 3%
    propertyPriceGrowthPerYear: 0.05, // 5%
    yearsForecast: 40, // 40 years
    affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
  };

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
      incomePerPersonYearly: 19090.0,
      averageRentYearly: 773.875 * 12,
      socialRentAverageEarning: 295.4,
      socialRentAdjustments: socialRentAdjustments,
      housePriceIndex: 75434.35,
      gasBillYearly: 800,
      property: property,
      forecastParameters: forecastParameters,
    });
  });

  it("can be instantiated", () => {
    expect(household).toBeInstanceOf(Household);
  });
});
