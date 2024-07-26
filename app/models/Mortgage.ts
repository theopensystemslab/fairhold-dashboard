export class Mortgage {
  propertyValue: number; //value of the property for the mortgage
  interestRate: number; // interest rate of the mortgage in percentage e.r, 0.05=5%
  termYears: number; // number of years of the mortgage
  initialDeposit: number; // initial deposit of the value of the mortgage in percentage e.g. 0.15 =15% deposit
  principal?: number; // amount of the morgage requested
  monthlyPayment?: number; // monthly rate of the mortgage
  totalMortgageCost?: number; // total cost of the mortgage
  yearlyPaymentBreakdown?: {
    yearlyPayment: number;
    cumulativePaid: number;
    remainingBalance: number;
  }[]; // yearly breakdown of the mortgage
  constructor({
    propertyValue,
    interestRate = 0.06,
    termOfTheMortgage = 30,
    initialDeposit = 0.15,
  }: {
    propertyValue: number;
    interestRate?: number;
    termOfTheMortgage?: number;
    initialDeposit?: number;
  }) {
    this.propertyValue = propertyValue;
    this.initialDeposit = initialDeposit;
    this.interestRate = interestRate;
    this.termYears = termOfTheMortgage;
    this.calculateAmountOfTheMortgage(); // calculate the amount of the mortgage
    this.calculateMonthlyMortgagePayment(); // calculate the montly payment
    this.calculateYearlyPaymentBreakdown(); // calculate the yearly breakdown;
  }

  calculateAmountOfTheMortgage() {
    this.principal = this.propertyValue * (1 - this.initialDeposit); // calculate the amount of the mortgage by removing the deposit
    return this.principal;
  }

  calculateMonthlyMortgagePayment() {
    const monthlyInterestRate = this.interestRate / 12; // Convert annual interest rate to monthly rate
    const numberOfPayments = this.termYears * 12; // Convert term in years to total number of payments
    if (this.principal !== undefined) {
      const monthlyPayment =
        (this.principal *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1); // Calculate the monthly payment
      this.monthlyPayment = parseFloat(monthlyPayment.toFixed(2)); // Store monthly payment rounded to 2 decimal places in class property
      this.totalMortgageCost = this.monthlyPayment * numberOfPayments; // total cost of the mortgage
      return this.monthlyPayment;
    } else {
      throw new Error("amountOfTheMortgage is undefined");
    }
  }
  calculateYearlyPaymentBreakdown() {
    if (this.monthlyPayment == undefined || this.totalMortgageCost == undefined)
      throw new Error("monthlyPayment or totalMortgageCost is undefined");

    let yearlyPayment =
      this.initialDeposit * this.propertyValue + this.monthlyPayment * 12;
    let cumulativePaid =
      this.initialDeposit * this.propertyValue + this.monthlyPayment * 12;
    let remainingBalance = this.totalMortgageCost - this.monthlyPayment * 12;

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    let yearlyPaymentBreakdown: mortgageBreakdownTypes[] = [
      {
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      },
    ]; // initialize the yearlyPaymentBreakdown

    for (let i = 0; i < this.termYears - 1; i++) {
      if (i != this.termYears - 1) {
        yearlyPayment = this.monthlyPayment * 12; // calculate the yearly payment
      } else {
        yearlyPayment = remainingBalance; // last year just pay the remaining balance
      }

      cumulativePaid = cumulativePaid + yearlyPayment; // calculate the updated cumulative paid
      remainingBalance = remainingBalance - yearlyPayment; // calculate the updated remaining balance
      yearlyPaymentBreakdown.push({
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      }); // add the current yearly payment to the yearlyPaymentBreakdown
    }
    this.yearlyPaymentBreakdown = yearlyPaymentBreakdown; // set the yearlyPaymentBreakdown
  }
}