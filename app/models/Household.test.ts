import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household";
import { Property } from "./Property";
import { socialRentAdjustmentTypes } from "../data/socialRentAdjustmentsRepo";

let property: Property;
let household: Household;
const socialRentAdjustments: socialRentAdjustmentTypes = [
  {
    inflation: 3.3,
    total: 4.3,
    year: "2001-02",
    additional: 0,
  },
  {
    inflation: 1.7,
    total: 2.2,
    year: "2002-03",
    additional: 0,
  },
  {
    inflation: 1.7,
    total: 2.2,
    year: "2003-04",
    additional: 0,
  },
  {
    inflation: 2.8,
    total: 3.3,
    year: "2004-05",
    additional: 0,
  },
  {
    inflation: 3.1,
    total: 3.6,
    year: "2005-06",
    additional: 0,
  },
  {
    inflation: 2.7,
    total: 3.2,
    year: "2006-07",
    additional: 0,
  },
  {
    inflation: 3.6,
    total: 4.1,
    year: "2007-08",
    additional: 0,
  },
  {
    inflation: 3.9,
    total: 4.4,
    year: "2008-09",
    additional: 0,
  },
  {
    inflation: 5.0,
    total: 5.5,
    year: "2009-10",
    additional: 0,
  },
  {
    inflation: -1.4,
    total: -0.9,
    year: "2010-11",
    additional: 0,
  },
  {
    inflation: 4.6,
    total: 5.1,
    year: "2011-12",
    additional: 0,
  },
  {
    inflation: 5.6,
    total: 6.1,
    year: "2012-13",
    additional: 0,
  },
  {
    inflation: 2.6,
    total: 3.1,
    year: "2013-14",
    additional: 0,
  },
  {
    inflation: 3.2,
    total: 3.7,
    year: "2014-15",
    additional: 0,
  },
  {
    inflation: 1.2,
    total: 2.2,
    year: "2015-16",
    additional: 0,
  },
  {
    inflation: NaN,
    total: -1.0,
    year: "2016-17",
    additional: 0,
  },
  {
    inflation: NaN,
    total: -1.0,
    year: "2017-18",
    additional: 0,
  },
  {
    inflation: NaN,
    total: -1.0,
    year: "2018-19",
    additional: 0,
  },
  {
    inflation: NaN,
    total: -1.0,
    year: "2019-20",
    additional: 0,
  },
  {
    inflation: 1.7,
    total: 2.7,
    year: "2020-21",
    additional: 0,
  },
  {
    inflation: 0.5,
    total: 1.5,
    year: "2021-22",
    additional: 0,
  },
  {
    inflation: 3.1,
    total: 4.1,
    year: "2022-23",
    additional: 0,
  },
  {
    inflation: 10.1,
    total: 11.1,
    year: "2023-24",
    additional: 0,
  },
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
    hpi2000: 58055.99,
  });

  household = new Household({
    incomePerPersonYearly: 19090.0,
    averageRentYearly: 773.875 * 12,
    countyAverageEarnings1999: 295.4,
    socialRentAdjustments: socialRentAdjustments,
    hpi2000: 75434.35,
    gasBillYearly: 800,
    property: property,
    forecastParameters: DEFAULT_FORECAST_PARAMETERS,
  });
});

it("can be instantiated", () => {
  expect(household).toBeInstanceOf(Household);
});
