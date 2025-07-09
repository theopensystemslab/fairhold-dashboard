import { Mortgage } from "../Mortgage";
import { FairholdLandPurchase } from "./FairholdLandPurchase";
import { createTestFairholdLandPurchase } from "../testHelpers";

const fairholdLandPurchase = createTestFairholdLandPurchase();

it("can be instantiated", () => {
  expect(fairholdLandPurchase).toBeInstanceOf(FairholdLandPurchase);
});

it("correctly instantiates to instances of the Mortgage class", () => {
  expect(fairholdLandPurchase.discountedLandMortgage).toBeInstanceOf(Mortgage)
  expect(fairholdLandPurchase.depreciatedHouseMortgage).toBeInstanceOf(Mortgage)
});

it("correctly calculates interest paid", () => {
  expect(fairholdLandPurchase.interestPaid).toBeCloseTo(192001.8)
})

it("correctly calculates interest saved", () => {
  expect(fairholdLandPurchase.interestSaved).toBeCloseTo(300310.5)
})