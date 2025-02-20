import { Mortgage } from "../Mortgage";
import { FairholdLandRent } from "./FairholdLandRent";
import { createTestFairholdLandRent } from "../testHelpers";

const fairholdLandRent = createTestFairholdLandRent();

it("can be instantiated", () => {
  expect(fairholdLandRent).toBeInstanceOf(FairholdLandRent);
});

it("instantiates an instance of Mortgage", () => {
  expect(fairholdLandRent.depreciatedHouseMortgage).toBeInstanceOf(Mortgage);
})

it("correctly calculates discountedLandRentMonthly", () => {
  expect(fairholdLandRent.discountedLandRentMonthly).toBeCloseTo(135); // TODO: check these calcs, I tried manually calculating this and I keep getting 180
})

it("correctly calculates interestPaid", () => {
  expect(fairholdLandRent.interestPaid).toBeCloseTo(147693.69);
})

it("correctly calculates interestSaved", () => {
  expect(fairholdLandRent.interestSaved).toBeCloseTo(344618.61);
})
