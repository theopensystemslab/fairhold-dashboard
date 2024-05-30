import { Mortgage, Fairhold } from "./classes";

// Unit test for the mortgage class
describe("Mortgage class", () => {
  it("can be instantiated", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });
    expect(mortgage).toBeDefined();
  });

  it("correctly calculates the amount of the mortgage ", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });

    expect(mortgage.amountOfTheMortgage).toBeCloseTo(90);
  });

  it("correctly calculates the amount of monthly payment ", () => {
    const mortgage = new Mortgage({
      propertyValue: 100,
      interestRate: 0.05,
      termOfTheMortgage: 25,
      initialDeposit: 0.1,
    });
    expect(mortgage.monthlyPayment).toBeCloseTo(0.53);
  });
});

// Unit test for the Fairhold class
describe("Fairhold class", () => {
  it("can be instantiated", () => {
    const fairhold = new Fairhold({
      affordability: 0.05,
      originalPrice: 100,
    });
    expect(fairhold).toBeDefined();
  });

  it("correctly calculates the fairhold formula below the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.1,
      originalPrice: 100,
    });
    const discount = fairhold.calculateFairholdDiscount();
    expect(fairhold.discount).toBeCloseTo(0.65);
  });

  it("correctly calculates the fairhold formula above the threshold", () => {
    const fairhold = new Fairhold({
      affordability: 0.9,
      originalPrice: 100,
      plateau: 3,
    });
    const discount = fairhold.calculateFairholdDiscount();
    expect(fairhold.discount).toBeCloseTo(3);
  });
});
