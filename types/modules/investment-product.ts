export interface InvestmentProduct {
    name: string;
    image: string;
    description: string;
    benefits: string[];
    minInvestment: number;           // Minimum investment amount (e.g., 100000)
    interestRate: number;            // Interest rate as a percentage (e.g., 8)
    minTenor: number;                // Minimum tenor in months (e.g., 3)
    maxTenor: number;                // Maximum tenor in months (e.g., 6)
    flexible: boolean;               // Indicates if the product is flexible
    canTopUp: boolean;               // Allows additional deposits
    canWithdrawEarly: boolean;       // Allows early withdrawals without penalties
    preLiquidationFee: number;       // Fee charged for early withdrawal (e.g., 10)
    interestPaymentSchedule: Array<"upfront" | "monthly" | "after-maturity">;
    automatedFrequency: Array<"one-off" | "daily" | "weekly" | "monthly">;
  }
  