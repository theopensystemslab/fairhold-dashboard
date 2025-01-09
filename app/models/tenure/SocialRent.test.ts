import { SocialRent } from "./SocialRent";
import { createTestSocialRent} from "../testHelpers";

const socialRent = createTestSocialRent();

it("can be instantiated", () => {
  expect(socialRent).toBeInstanceOf(SocialRent);
});

it("correctly calculates adjustedSocialRentMonthly", () => {
  expect(socialRent.adjustedSocialRentMonthly).toBeCloseTo(530.497)
})

it("correctly calculates socialRentMonthlyLand and socialRentMonthlyHouse", () => {
  expect(socialRent.socialRentMonthlyLand).toBeCloseTo(318.298)
  expect(socialRent.socialRentMonthlyHouse).toBeCloseTo(212.199)
})

it("can be instantiated with number of bedrooms above the threshold", () => {
  const largeBedSocialRent = createTestSocialRent({
    numberOfBedrooms: 10,
  });

  expect(largeBedSocialRent).toBeInstanceOf(SocialRent);
  expect(largeBedSocialRent.adjustedSocialRentMonthly).toBeCloseTo(650.4);
});
