import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS } from "../ForecastParameters";
import { FairholdLandPurchase } from "./FairholdLandPurchase";

let tenureFairholdLandPurchase: FairholdLandPurchase;

beforeEach(() => {
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
