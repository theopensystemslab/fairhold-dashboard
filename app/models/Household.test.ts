import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household";
import { Property } from "./Property";

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
    averageMarketPrice: 218091.58,
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
    forecastParameters: DEFAULT_FORECAST_PARAMETERS,
  });
});

it("can be instantiated", () => {
  expect(household).toBeInstanceOf(Household);
});