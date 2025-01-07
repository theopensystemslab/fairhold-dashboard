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
  year: number;
  yearlyPayment: number;
  cumulativePaid: number;
  cumulativeInterestPaid: number;
  cumulativePrincipalPaid: number;
  remainingBalance: number;
}[];

/** 
 * The `Mortgage` class is instantiated each time a mortgage needs to be calculated,
 * meaning per-type of property, eg land or house, per-tenure
 */
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
  /** This includes principal, monthly repayments and interest */
  totalMortgageCost: number;
  yearlyPaymentBreakdown: MortgageBreakdown;
  totalInterest: number;

  constructor(params: MortgageParams) {
    this.propertyValue = params.propertyValue;
    this.initialDeposit = params.initialDeposit || DEFAULT_INITIAL_DEPOSIT;
    this.interestRate = params.interestRate || DEFAULT_INTEREST_RATE;
    this.termYears = params.mortgageTerm || DEFAULT_MORTGAGE_TERM;

    // Computed properties, order is significant
    this.principal = this.calculateMortgagePrincipal();

    const { monthlyPayment, totalMortgageCost } =
      this.calculateMonthlyMortgagePayment();
    this.monthlyPayment = monthlyPayment;
    this.totalMortgageCost = totalMortgageCost;

    this.yearlyPaymentBreakdown = this.calculateYearlyPaymentBreakdown();
    this.totalInterest = this.calculateTotalInterest();
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

    const totalMortgageCost = parseFloat((monthlyPayment * numberOfPayments).toFixed(2));
    
    // Putting the rounding after the totalMortgageCost calculation for precision
    monthlyPayment = parseFloat(monthlyPayment.toFixed(2));
    return { monthlyPayment, totalMortgageCost };
  }
  private calculateYearlyPaymentBreakdown() {
    const monthlyRate = this.interestRate / MONTHS_PER_YEAR;
    
    // Initial year (year 0) calculations 
    let yearlyPayment = 
      this.initialDeposit * this.propertyValue +
      this.monthlyPayment * MONTHS_PER_YEAR;
    let cumulativePaid = yearlyPayment;
    
    // Calculate first year's interest and principal
    let balance = parseFloat(this.principal.toFixed(10));  // This method uses this throughout to ensure consistent precision, was hitting errors
    let yearInterestPaid = 0;
    let yearPrincipalPaid = 0;
    
    // Calculate first year's monthly payments
    for (let month = 0; month < MONTHS_PER_YEAR; month++) {
      const monthlyInterest = parseFloat((balance * monthlyRate).toFixed(10)); 
      const monthlyPrincipal = parseFloat((this.monthlyPayment - monthlyInterest).toFixed(10)); 
      
      yearInterestPaid += monthlyInterest;
      yearPrincipalPaid += monthlyPrincipal;
      balance = parseFloat((balance - monthlyPrincipal).toFixed(10)); 
    }
    
    let cumulativeInterestPaid = yearInterestPaid;
    let cumulativePrincipalPaid = yearPrincipalPaid;
    let remainingBalance = balance;

    const yearlyPaymentBreakdown: MortgageBreakdown = [
      {
        year: 0,
        yearlyPayment,
        cumulativePaid,
        cumulativeInterestPaid,
        cumulativePrincipalPaid,
        remainingBalance,
      },
    ];

    for (let i = 1; i < this.termYears; i++) {
      yearlyPayment = this.monthlyPayment * MONTHS_PER_YEAR;
      cumulativePaid += yearlyPayment;
      
      yearInterestPaid = 0;
      yearPrincipalPaid = 0;
      
      // Calculate each month's breakdown
      for (let month = 0; month < MONTHS_PER_YEAR; month++) {
        const monthlyInterest = parseFloat((balance * monthlyRate).toFixed(10)); 
        const monthlyPrincipal = parseFloat((this.monthlyPayment - monthlyInterest).toFixed(10)); 
        
        yearInterestPaid += monthlyInterest;
        yearPrincipalPaid += monthlyPrincipal;
        balance = parseFloat((balance - monthlyPrincipal).toFixed(10)); 
      }
      
      cumulativeInterestPaid = parseFloat((cumulativeInterestPaid + yearInterestPaid).toFixed(10)); 
      cumulativePrincipalPaid = parseFloat((cumulativePrincipalPaid + yearPrincipalPaid).toFixed(10)); 
      i === (this.termYears - 1) ? remainingBalance = 0 : remainingBalance = balance;

      yearlyPaymentBreakdown.push({
        year: i,
        yearlyPayment,
        cumulativePaid,
        cumulativeInterestPaid,
        cumulativePrincipalPaid,
        remainingBalance,
      });
    }

    return yearlyPaymentBreakdown;
  }
  
  private calculateTotalInterest() {
    const totalInterest = parseFloat((this.totalMortgageCost - this.principal).toFixed(2))
    return totalInterest
  }
}
