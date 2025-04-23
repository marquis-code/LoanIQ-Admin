import { GATEWAY_ENDPOINT } from "../axios.config";
import { InvestmentData, RemainingInvestmentAmount } from '@/types/modules/investment'
export const investment_api = {
  $_create_investment: (payload: InvestmentData) => {
    let url = '/investment/create';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_active_investment: (metadata: { page: number; pageSize: number }) => {
    let url = `/investment/active-investments?page=${metadata.page}&pageSize=${metadata.pageSize}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_completed_investment: (metadata: { page: number; pageSize: number }) => {
    let url = `/investment/completed-investments?page=${metadata.page}&pageSize=${metadata.pageSize}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_deactivated_investment: (metadata: { page: number; pageSize: number }) => {
    let url = `/investment/deactivated-investments?page=${metadata.page}&pageSize=${metadata.pageSize}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_investment_summary: (id: string | any) => {
    let url = `/investment/summary/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_remaining_amount: (amount: any, payload: RemainingInvestmentAmount) => {
    let url = `/investment/get-remaining-amount/${amount}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_investment_details: (id: string | any) => {
    let url = `/investment/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_rollover_investment: (id: string | any, payload: any) => {
    let url = `/investment/rollover/${id}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_topup_investment: (id: string | any, payload: any) => {
    let url = `/investment/topup/${id}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_maturing_investments: () => {
    let url = `/investment/maturing-investments`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_liquidate_investment: (id: string | any, payload: any) => {
    let url = `/investment/liquidate/${id}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_approve_reject_liquidate_investment: (taskId: string, payload: any) => {
    let url = `/investment/liquidation/${taskId}/approve`;
    return GATEWAY_ENDPOINT.post(url, payload);
  }
};
