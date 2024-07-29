import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS } from "../ForecastParameters";
import { Property } from "../Property";
import { FairholdLandPurchase } from "./FairholdLandPurchase";
import { MarketPurchase } from "./MarketPurchase";

let tenureFairholdLandPurchase: FairholdLandPurchase;

beforeEach(() => {
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
    ...DEFAULT_FORECAST_PARAMETERS,
  });

  tenureFairholdLandPurchase = new FairholdLandPurchase({
    //incomeYearly: 45816,
    //averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    //landPrice: 31531.579,
    ...DEFAULT_FORECAST_PARAMETERS,
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
