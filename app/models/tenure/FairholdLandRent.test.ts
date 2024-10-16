import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS, ForecastParameters } from "../ForecastParameters";
import { FairholdLandRent } from "./FairholdLandRent";
import { MarketPurchase } from "./MarketPurchase"

let tenureFairholdLandRent: FairholdLandRent;

beforeEach(() => {
    // partial MarketPurchase object with only necessary properties for test (instead of mocking a whole MarketPurchase object)
    const partialMarketPurchase: Pick<MarketPurchase, 'interestPaid'> = {
      interestPaid: 200000, 
    };

  const forecastParameters: ForecastParameters = {
    ...DEFAULT_FORECAST_PARAMETERS,
  };

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
    forecastParameters: forecastParameters,
    marketPurchase: partialMarketPurchase as MarketPurchase
  })
});

it("can be instantiated", () => {
  expect(tenureFairholdLandRent).toBeInstanceOf(FairholdLandRent);
});
