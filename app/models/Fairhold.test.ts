import { Fairhold } from "./Fairhold";

it("can be instantiated", () => {
  const fairhold = new Fairhold({
    affordability: 0.05,
    landPriceOrRent: 100,
  });
  expect(fairhold).toBeDefined();
});

it("correctly calculates the fairhold formula below the threshold", () => {
  const fairhold = new Fairhold({
    affordability: 0.15,
    landPriceOrRent: 100,
  });
  expect(fairhold.discountLand).toBeCloseTo(0.535);
});

it("correctly calculates the fairhold formula above the threshold", () => {
  const fairhold = new Fairhold({
    affordability: 0.5,
    landPriceOrRent: 100,
  });
  expect(fairhold.discountLand).toBeCloseTo(0.15);
});

it("correctly deals with negative values of landPriceOrRent", () => {
  const fairhold = new Fairhold({
    affordability: 0.05,
    landPriceOrRent: -100,
  });
  expect(fairhold.discountedLandPriceOrRent).toBeCloseTo(1);
});
