import { Mortgage } from "./Mortgage";

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

  expect(mortgage.principal).toBeCloseTo(90);
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
