// Types for the entire application
export interface Analytics {
    total_inflows: number
    total_outflows: number
    total_pending_transacations: number
    total_credit: number
    total_debit: number
  }
  
  export interface RevenueAnalytics {
    total_amount_invested: number
    total_interest_accured: number
    standing: number
  }
  
  export interface Transaction {
    id: string
    type: string
    amount: number
    status: string
    createdAt: string
    description: string
    walletId: string
    flagged: boolean
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    status: string
    createdAt: string
    dueDate: string
    priority: 'low' | 'medium' | 'high'
  }
  
  export interface ExternalInvestment {
    id: string
    description: string
    company: string
    amount: number
    investmentRate: string
    startDate: string
    endDate: string
    tenor: string
    accuredInterest: string
    investmentStatus: string
    status: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
  }