export const calculate_roi = (principal: number, annual_rate: number, days: number) => {
    const daily_rate = annual_rate / 365
    const interest = principal * daily_rate * days
    return interest;
  }