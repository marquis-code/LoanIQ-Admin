import { GATEWAY_ENDPOINT } from "../axios.config";
import { ExternalInvestment } from '@/types/modules/finance'

export const finance_api = {
  $_get_analytics: () => {
    let url = `/financial-management/transactions/analytics`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_transactions: () => {
    let url = `/financial-management/transactions`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_flag_wallet: (walletId: string) => {
    let url = `/financial-management/flag-wallet/${walletId}`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_get_all_tasks: () => {
    let url = `/financial-management/tasks`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_unflag_wallet: (walletId: string) => {
    let url = `/financial-management/unflag-wallet/${walletId}`;
    return GATEWAY_ENDPOINT.patch(url);
  },
  $_update_flagging_status: (walletId: string, payload: { status: string }) => {
    let url = `/financial-management/approve-or-reject/${walletId}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_revenue_stream_analytics: () => {
    let url = `/financial-management/revenue-analytics`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_external_investments: () => {
    let url = `/financial-management/revenue-streams`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_add_external_investments: (payload: ExternalInvestment) => {
    let url = `/financial-management/add-external-investment`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_approve_reject_external_investment: (
    investmentId: string,
    payload: { status: string }
  ) => {
    let url = `/financial-management/external-investment/${investmentId}/approve-or-reject`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_edit_external_investments: (
    investmentId: string,
    payload: { company: string }
  ) => {
    let url = `/financial-management/external-investment/${investmentId}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_delete_external_investment: (investmentId: string) => {
    let url = `/financial-management/external-investment/${investmentId}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
};
