import { Household } from "./Household";
import { createTestHousehold } from "./testHelpers";

let household = createTestHousehold();

beforeEach(() => {
  household = createTestHousehold();
});

/* The Household class only needs tests for instantiation; 
* calculation tests are in the test files for the sub classes (eg for the tenures or the Lifetime class) */
it("can be instantiated", () => {
  expect(household).toBeInstanceOf(Household);
});

it("contains all tenure classes", () => {
  expect(household).toHaveProperty("tenure"),
  expect(household.tenure).toHaveProperty("marketPurchase"),
  expect(household.tenure).toHaveProperty("marketRent"),
  expect(household.tenure).toHaveProperty("socialRent"),
  expect(household.tenure).toHaveProperty("fairholdLandPurchase"),
  expect(household.tenure).toHaveProperty("fairholdLandRent")
})

it("contains an instance of Lifetime", () => {
  expect(household).toHaveProperty("lifetime")
})