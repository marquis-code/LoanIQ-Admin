import { GATEWAY_ENDPOINT } from "../axios.config";
export const users_api = {
  $_get_users: () => {
    let url = '/user';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_details: (id: string, payload: Record<string, any>) => {
    let url = `/user/${id}`;
    return GATEWAY_ENDPOINT.get(url, payload);
  },
  $_block_user: (id: string) => {
    let url = `/user/block/${id}`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_unblock_user: (id: string) => {
    let url = `/user/unblock/${id}`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_flag_user_account: (id: string) => {
    let url = `/user/flag/${id}`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_unflag_user_account: (id: string) => {
    let url = `/user/unblock/${id}`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_create_user: (payload: any) => {
    let url = '/user/new-user';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_generate_account_number: (id: string) => {
    let url = `/user/generate-account-number/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_submit_account_number_request: (payload: any) => {
    let url = `/user/submit-account-number-request`;
    return GATEWAY_ENDPOINT.post(url, payload);
  }
};
