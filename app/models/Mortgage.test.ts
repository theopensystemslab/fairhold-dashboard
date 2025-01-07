import { Mortgage } from "./Mortgage";

const mortgage = new Mortgage({
  propertyValue: 100000,
  interestRate: 0.05,
  mortgageTerm: 25,
  initialDeposit: 0.1,
});

console.log({mortgage})

it("can be instantiated", () => {
  expect(mortgage).toBeDefined();
});

it("correctly calculates the amount of the mortgage ", () => {
  expect(mortgage.principal).toBeCloseTo(90000);
});

it("correctly calculates the amount of monthly payment ", () => {
  expect(mortgage.monthlyPayment).toBeCloseTo(526.13);
});

it("correctly calculates the total mortgage cost", () => {
  expect(mortgage.totalMortgageCost).toBeCloseTo(157839.31);
})

it("correctly calculates the split between interest and principal", () => {
  const breakdown = mortgage.yearlyPaymentBreakdown;
  console.log({breakdown})
  
  expect(breakdown[0].yearlyPayment).toBeCloseTo(16313.56); // Higher figure because it includes the deposit
  expect(breakdown[0].cumulativePaid).toBeCloseTo(16313.56);
  expect(breakdown[0].remainingBalance).toBeCloseTo(88144.3);

  expect(breakdown.length).toBe(25);})

it("correctly calculates the total interest paid", () => {
  expect(mortgage.totalInterest).toBeCloseTo(67839.31)
})
