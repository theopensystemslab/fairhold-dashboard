import { MONTHS_PER_YEAR } from "./constants";

const DEFAULT_INTEREST_RATE = 0.06;
const DEFAULT_MORTGAGE_TERM = 30;
const DEFAULT_INITIAL_DEPOSIT = 0.15;

type MortgageBreakdown = {
  yearlyPayment: number;
  cumulativePaid: number;
  remainingBalance: number;
}[];

export class Mortgage {
  propertyValue: number;
  /**
   * This value is given as a percentage. For example, 0.05 represents a 5% rate
   */
  interestRate: number;
  termYears: number;
  /**
   * This value is given as a percentage. For example, 0.15 represents a 15% deposit
   */
  initialDeposit: number;
  /**
   * The principle is the value of the property, minus the deposit
   */
  principal: number;
  monthlyPayment: number;
  totalMortgageCost: number;
  yearlyPaymentBreakdown: MortgageBreakdown;

  constructor({
    propertyValue,
    interestRate = DEFAULT_INTEREST_RATE,
    mortgageTerm = DEFAULT_MORTGAGE_TERM,
    initialDeposit = DEFAULT_INITIAL_DEPOSIT,
  }: {
    propertyValue: number;
    interestRate?: number;
    mortgageTerm?: number;
    initialDeposit?: number;
  }) {
    this.propertyValue = propertyValue;
    this.initialDeposit = initialDeposit;
    this.interestRate = interestRate;
    this.termYears = mortgageTerm;
    this.principal = this.calculateMortgagePrinciple();

    const { monthlyPayment, totalMortgageCost } =
      this.calculateMonthlyMortgagePayment();
    this.monthlyPayment = monthlyPayment;
    this.totalMortgageCost = totalMortgageCost;

    this.yearlyPaymentBreakdown = this.calculateYearlyPaymentBreakdown();
  }

  private calculateMortgagePrinciple() {
    const principal = this.propertyValue * (1 - this.initialDeposit);
    return principal;
  }

  private calculateMonthlyMortgagePayment() {
    const monthlyInterestRate = this.interestRate / MONTHS_PER_YEAR;
    const numberOfPayments = this.termYears * MONTHS_PER_YEAR;

    let monthlyPayment =
      (this.principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    monthlyPayment = parseFloat(monthlyPayment.toFixed(2));

    const totalMortgageCost = monthlyPayment * numberOfPayments;

    return { monthlyPayment, totalMortgageCost };
  }
  private calculateYearlyPaymentBreakdown() {
    let yearlyPayment =
      this.initialDeposit * this.propertyValue +
      this.monthlyPayment * MONTHS_PER_YEAR;
    let cumulativePaid =
      this.initialDeposit * this.propertyValue +
      this.monthlyPayment * MONTHS_PER_YEAR;
    let remainingBalance =
      this.totalMortgageCost - this.monthlyPayment * MONTHS_PER_YEAR;

    let yearlyPaymentBreakdown: MortgageBreakdown = [
      {
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      },
    ];

    for (let i = 0; i < this.termYears - 1; i++) {
      if (i != this.termYears - 1) {
        yearlyPayment = this.monthlyPayment * MONTHS_PER_YEAR;
      } else {
        // last year just pay the remaining balance
        yearlyPayment = remainingBalance;
      }

      cumulativePaid = cumulativePaid + yearlyPayment;
      remainingBalance = remainingBalance - yearlyPayment;

      yearlyPaymentBreakdown.push({
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      });
    }

    return yearlyPaymentBreakdown;
  }
}
