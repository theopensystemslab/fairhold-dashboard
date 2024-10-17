import { MONTHS_PER_YEAR } from "./constants";

const DEFAULT_INTEREST_RATE = 0.06;
const DEFAULT_MORTGAGE_TERM = 30;
const DEFAULT_INITIAL_DEPOSIT = 0.15;

interface MortgageParams {
  propertyValue: number;
  interestRate?: number;
  mortgageTerm?: number;
  initialDeposit?: number;
}

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
   * The principal is the value of the property, minus the deposit
   */
  principal: number;
  monthlyPayment: number;
  totalMortgageCost: number;
  yearlyPaymentBreakdown: MortgageBreakdown;

  constructor(params: MortgageParams) {
    this.propertyValue = params.propertyValue;
    this.initialDeposit = params.initialDeposit || DEFAULT_INITIAL_DEPOSIT;
    this.interestRate = params.interestRate || DEFAULT_INTEREST_RATE;
    this.termYears = params.mortgageTerm || DEFAULT_MORTGAGE_TERM;

    // Computed properties, order is significant
    this.principal = this.calculateMortgageprincipal();

    const { monthlyPayment, totalMortgageCost } =
      this.calculateMonthlyMortgagePayment();
    this.monthlyPayment = monthlyPayment;
    this.totalMortgageCost = totalMortgageCost;

    this.yearlyPaymentBreakdown = this.calculateYearlyPaymentBreakdown();
  }

  private calculateMortgagePrincipal() {
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

    const yearlyPaymentBreakdown: MortgageBreakdown = [
      {
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      },
    ];
    const isFinalYear = this.termYears - 2;
    for (let i = 0; i < this.termYears - 1; i++) {
      if (i == isFinalYear) {
        yearlyPayment = remainingBalance;
        continue;
      }
      yearlyPayment = this.monthlyPayment * MONTHS_PER_YEAR;

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
