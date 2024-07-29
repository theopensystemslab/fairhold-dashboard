import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS } from "../ForecastParameters";
import { Property } from "../Property";
import { FairholdLandRent } from "./FairholdLandRent";
import { MarketRent } from "./MarketRent";

let tenureFairholdLandRent: FairholdLandRent;

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

  let tenureMarketRent = new MarketRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landPrice: 31531.579,
    ...DEFAULT_FORECAST_PARAMETERS,
  });

  tenureFairholdLandRent = new FairholdLandRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landPrice: 31531.579,
    ...DEFAULT_FORECAST_PARAMETERS,
    fairhold: new Fairhold({
      affordability: 0.2,
      landPriceOrRent: 20000,
    }),
  });
});

it("can be instantiated", () => {
  expect(tenureFairholdLandRent).toBeInstanceOf(FairholdLandRent);
});
