import { Fairhold } from "../Fairhold";
import { DEFAULT_FORECAST_PARAMETERS } from "../ForecastParameters";
import { FairholdLandRent } from "./FairholdLandRent";

let tenureFairholdLandRent: FairholdLandRent;

beforeEach(() => {
  tenureFairholdLandRent = new FairholdLandRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    averageMarketPrice: 218091.58,
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
