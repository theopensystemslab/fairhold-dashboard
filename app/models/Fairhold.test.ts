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
    affordability: 0.05,
    landPriceOrRent: 100,
  });
  expect(fairhold.discountLand).toBeCloseTo(0.6877641290737884);
});

it("correctly calculates the fairhold formula above the threshold", () => {
  const fairhold = new Fairhold({
    affordability: 0.05,
    landPriceOrRent: 100,
    plateau: 3,
  });
  expect(fairhold.discountLand).toBeCloseTo(0.68776);
});
