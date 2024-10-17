import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS, ForecastParameters } from "../ForecastParameters";
import { FairholdLandPurchase } from "./FairholdLandPurchase";
import { MarketPurchase } from "./MarketPurchase"

let tenureFairholdLandPurchase: FairholdLandPurchase;

beforeEach(() => {
  // partial MarketPurchase object with only necessary properties for test (instead of mocking a whole MarketPurchase object)
  const partialMarketPurchase: Pick<MarketPurchase, 'interestPaid'> = {
    interestPaid: 200000, 
  };

  const forecastParameters: ForecastParameters = {
    ...DEFAULT_FORECAST_PARAMETERS,
  };

  tenureFairholdLandPurchase = new FairholdLandPurchase({
    //incomeYearly: 45816,
    //averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    //landPrice: 31531.579,
    affordability: 0.2,
    fairhold: new Fairhold({
      affordability: 0.2,
      landPriceOrRent: 31531.579,
    }),
    forecastParameters: forecastParameters,
    marketPurchase: partialMarketPurchase as MarketPurchase
  });
});

it("can be instantiated", () => {
  expect(tenureFairholdLandPurchase).toBeInstanceOf(FairholdLandPurchase);
});
