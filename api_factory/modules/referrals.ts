import { GATEWAY_ENDPOINT } from "../axios.config";
export const referral_api = {
  $_create_referral_code: (payload: { name: string, email: string, code: string }) => {
    let url = `/referral-codes`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_update_referral_code: (id: string, payload: { name: string}) => {
    let url = `/referral-codes/${id}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_fetch_referral_codes: () => {
    let url = `/referral-codes`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_referral_code_users: (id: string) => {
    let url = `/referral-codes/${id}/users`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_deactivate_referral_code: (id: string) => {
    let url = `/referral-codes/${id}/deactivate`;
    return GATEWAY_ENDPOINT.patch(url);
  }
}