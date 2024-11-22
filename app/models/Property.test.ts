import { Property } from "./Property";

let property: Property;

beforeEach(() => {
  property = new Property({
    postcode: "WV8 1HG",
    houseType: "T",
    numberOfBedrooms: 2,
    age: 10,
    size: 88,
    maintenancePercentage: 0.02,
    newBuildPricePerMetre: 2120,
    averageMarketPrice: 218091.58,
    itl3: "TLG24",
  });
});

it("can be instantiated", () => {
  expect(property).toBeInstanceOf(Property);
});

it("correctly calculates the newBuildPrice", () => {
  expect(property.newBuildPrice).toBeCloseTo(186560);
});

it("correctly calculates the depreciatedBuildPrice for existing builds (age > 0)", () => {
  expect(property.depreciatedBuildPrice).toBeCloseTo(172988.92);
});

it("correctly calculates depreciatedBuildPrice for newbuilds (age = 0)", () => {
  property = new Property({
    postcode: "WV8 1HG",
    houseType: "T",
    numberOfBedrooms: 2,
    age: 1,
    size: 88,
    maintenancePercentage: 0.02,
    newBuildPricePerMetre: 2120,
    averageMarketPrice: 218091.58,
    itl3: "TLG24",
  });
  expect(property.depreciatedBuildPrice).toBeCloseTo(186560)
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

it("correctly calculates the values even for number of bedroooms exceeding the max ", () => {
  property = new Property({
    postcode: "WV8 1HG",
    houseType: "T",
    numberOfBedrooms: 20,
    age: 9,
    size: 88,
    maintenancePercentage: 0.02,
    newBuildPricePerMetre: 2120,
    averageMarketPrice: 218091.58,
    itl3: "TLG24",
  });
  expect(property).toBeInstanceOf(Property);
});
