import { MarketRent } from "./MarketRent";
import { createTestMarketRent } from "../testHelpers";

const marketRent = createTestMarketRent();

it("can be instantiated", () => {
  expect(marketRent).toBeInstanceOf(MarketRent);
});

it("correctly calculates split for land and house", () => {
  expect(marketRent.averageRentLandMonthly).toBeCloseTo(900);
  expect(marketRent.averageRentHouseMonthly).toBeCloseTo(600);
});

it("correctly calculates rent affordability", () => {
  expect(marketRent.affordability).toBeCloseTo(.6);
})

