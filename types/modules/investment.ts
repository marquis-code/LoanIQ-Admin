export interface InvestmentData {
    email: string;
    name: string;
    productId: string;
    principal: number;
    automatedFrequency: string;
    interestPaymentSchedule: string;
    paymentMethod: string;
  }
  

  export interface RemainingInvestmentAmount {
    name: string;
    productId: string;
    amount: string
}