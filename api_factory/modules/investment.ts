import { GATEWAY_ENDPOINT } from "../axios.config";
export const investment_api = {
  $_create_investment: (payload: Record<string, any>) => {
    let url = '/investment/create';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_active_investment: () => {
    let url = '/investment/active-investments';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_completed_investment: () => {
    let url = '/investment/completed-investments';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_deactivated_investment: () => {
    let url = '/investment/deactivated-investments';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_investment_summary: (id: string) => {
    let url = `/investment/summary/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_remaining_amount: (amount: any, payload: any) => {
    let url = `/investment/get-remaining-amount/${amount}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_investment_details: (id: string) => {
    let url = `admin/investment/product/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  }
};
