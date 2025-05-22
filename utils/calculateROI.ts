export const calculate_roi = (principal: number, annual_rate: number, days: number) => {
    const daily_rate = annual_rate / 365
    const interest = principal * daily_rate * days
    return interest;
  }

export function daysToMonths(days: number): number {
    const averageDaysInMonth = 30.44; // Average number of days in a month
    const month = days / averageDaysInMonth;
    return Math.round(month);
  }


  export function convertToWholeNumber(number: number): number {
    return Math.round(number);
  }