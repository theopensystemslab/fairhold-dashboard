import { Property } from "./Property";

let property: Property;

beforeEach(() => {
  property = new Property({
    postcode: "WV8 1HG",
    houseType: "T",
    numberOfBedrooms: 2,
    age: 10,
    size: 88,
    newBuildPricePerMetre: 2120,
    averagePrice: 218091.58,
    itl3: "TLG24",
  });
});

it("can be instantiated", () => {
  expect(property).toBeInstanceOf(Property);
});

it("correctly calculates the newBuildPrice", () => {
  expect(property.newBuildPrice).toBeCloseTo(186560);
});

it("correctly calculates the depreciatedBuildPrice", () => {
  expect(property.depreciatedBuildPrice).toBeCloseTo(110717.45);
});

it("correctly calculates the bedWeightedAveragePrice", () => {
  expect(property.bedWeightedAveragePrice).toBeCloseTo(218091.58);
});

it("correctly calculates the landPrice", () => {
  expect(property.landPrice).toBeCloseTo(31531.579);
});

it("correctly calculates the landToTotalRatio", () => {
  expect(property.landToTotalRatio).toBeCloseTo(0.14);
});
