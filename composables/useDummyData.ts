import { ref } from 'vue'
import type { Analytics, RevenueAnalytics, Transaction, Task, ExternalInvestment } from '@/types'

export const useDummyData = () => {
  const analytics = ref<Analytics>({
    total_inflows: 250000,
    total_outflows: 150000,
    total_pending_transacations: 3,
    total_credit: 300000,
    total_debit: 200000
  })

  const revenueAnalytics = ref<RevenueAnalytics>({
    total_amount_invested: 2000000,
    total_interest_accured: 8.1,
    standing: -1799600
  })

  const transactions = ref<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 50000,
      status: 'completed',
      createdAt: '2025-02-23T10:00:00Z',
      description: 'Investment return',
      walletId: 'wallet1',
      flagged: false
    },
    {
      id: '2',
      type: 'debit',
      amount: 25000,
      status: 'pending',
      createdAt: '2025-02-23T11:00:00Z',
      description: 'Withdrawal request',
      walletId: 'wallet2',
      flagged: true
    }
  ])

  const tasks = ref<Task[]>([
    {
      id: '1',
      title: 'Review Investment Proposal',
      description: 'Review and approve new investment proposal from Homes & Co',
      status: 'pending',
      createdAt: '2025-02-23T09:00:00Z',
      dueDate: '2025-02-24T17:00:00Z',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Process Refund Request',
      description: 'Process pending refund request for transaction #12345',
      status: 'in-progress',
      createdAt: '2025-02-23T10:00:00Z',
      dueDate: '2025-02-23T16:00:00Z',
      priority: 'medium'
    }
  ])

  const investments = ref<ExternalInvestment[]>([
    {
      id: 'e02f039d-7776-435c-a0f6-a01245bde201',
      description: 'Real Estate Investment',
      company: 'Homes & Co',
      amount: 1000000,
      investmentRate: '10%',
      startDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-04-02T00:00:00.000Z',
      tenor: '2 months',
      accuredInterest: '4.05',
      investmentStatus: 'in-progress',
      status: 'pending',
      isDeleted: false,
      createdAt: '2025-02-12T20:31:42.293Z',
      updatedAt: '2025-02-12T20:31:42.294Z'
    },
    {
      id: 'a66f751a-5cbc-40ef-9ee2-b284140c528d',
      description: 'Tech Startup Investment',
      company: 'TechVentures Inc',
      amount: 500000,
      investmentRate: '15%',
      startDate: '2025-03-01T00:00:00.000Z',
      endDate: '2025-06-01T00:00:00.000Z',
      tenor: '3 months',
      accuredInterest: '2.5',
      investmentStatus: 'pending',
      status: 'approved',
      isDeleted: false,
      createdAt: '2025-02-12T20:16:04.206Z',
      updatedAt: '2025-02-12T20:55:42.656Z'
    }
  ])

  return {
    analytics,
    revenueAnalytics,
    transactions,
    tasks,
    investments
  }
}