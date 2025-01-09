import { MarketPurchase } from "./MarketPurchase";
import { Mortgage } from "../Mortgage";
import { createTestMarketPurchase } from "../testHelpers";

const marketPurchase = createTestMarketPurchase();

it("can be instantiated", () => {
  expect(marketPurchase).toBeInstanceOf(MarketPurchase);
});

it("instantiates instances of the Mortgage class", () => {
  expect(marketPurchase.houseMortgage).toBeInstanceOf(Mortgage);
  expect(marketPurchase.landMortgage).toBeInstanceOf(Mortgage)
})

it("correctly calculates affordability", () => {
  expect(marketPurchase.affordability).toBeCloseTo(1.019)
})

it("correctly calculates interest paid", () => {
  expect(marketPurchase.interestPaid).toBeCloseTo(492312.3)
})