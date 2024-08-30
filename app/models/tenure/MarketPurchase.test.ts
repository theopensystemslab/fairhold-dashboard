import { MarketPurchase } from "./MarketPurchase";
import { DEFAULT_FORECAST_PARAMETERS, ForecastParameters } from "../ForecastParameters";

let tenureMarketPurchase: MarketPurchase;

beforeEach(() => {
  const forecastParameters: ForecastParameters = {
    ...DEFAULT_FORECAST_PARAMETERS,
  };

  tenureMarketPurchase = new MarketPurchase({
    incomeYearly: 45816,
    averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landPrice: 31531.579,
    forecastParameters: forecastParameters,
  });
});

it("can be instantiated", () => {
  expect(tenureMarketPurchase).toBeInstanceOf(MarketPurchase);
});
