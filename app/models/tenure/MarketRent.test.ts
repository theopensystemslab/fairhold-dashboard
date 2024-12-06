import { MarketRent } from "./MarketRent";
import { DEFAULT_FORECAST_PARAMETERS, ForecastParameters } from "../ForecastParameters";

let tenureMarketRent: MarketRent;

beforeEach(() => {
  const forecastParameters: ForecastParameters = {
    ...DEFAULT_FORECAST_PARAMETERS,
  };

  tenureMarketRent = new MarketRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landToTotalRatio: 0.1446,
    forecastParameters: forecastParameters,
  });
});

it("can be instantiated", () => {
  expect(tenureMarketRent).toBeInstanceOf(MarketRent);
});
