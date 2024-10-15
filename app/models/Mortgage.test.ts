import { Mortgage } from "./Mortgage";

it("can be instantiated", () => {
  const mortgage = new Mortgage({
    propertyValue: 100,
    interestRate: 0.05,
    mortgageTerm: 25,
    initialDeposit: 0.1,
  });
  expect(mortgage).toBeDefined();
});

it("correctly calculates the amount of the mortgage ", () => {
  const mortgage = new Mortgage({
    propertyValue: 100,
    interestRate: 0.05,
    mortgageTerm: 25,
    initialDeposit: 0.1,
  });

  expect(mortgage.principle).toBeCloseTo(90);
});

it("correctly calculates the amount of monthly payment ", () => {
  const mortgage = new Mortgage({
    propertyValue: 100,
    interestRate: 0.05,
    mortgageTerm: 25,
    initialDeposit: 0.1,
  });
  expect(mortgage.monthlyPayment).toBeCloseTo(0.53);
});
