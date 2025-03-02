import { GATEWAY_ENDPOINT } from "../axios.config";
export const users_api = {
  $_create_user: (payload: { email: string; bvn: string }) => {
    let url = "/user/new-user";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_generate_account_number: (id: string) => {
    let url = `/user/generate-account-number/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_submit_account_number_request: (payload: {
    otp: string;
    userId: string;
    trackingId: string;
  }) => {
    let url = `/user/submit-account-number-request`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_users: (metadata: { page: number; pageSize: number }) => {
    let url = `/user?page=${metadata.page}&pageSize=${metadata.pageSize}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_details: (id: string) => {
    let url = `/user/${id}`;
    return GATEWAY_ENDPOINT.get(url);
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
  $_get_user_transactions: (id: string, metadata: { page: number; pageSize: number }) => {
    let url = `/user/transactions/${id}?page=${metadata.page}&pageSize=${metadata.pageSize}`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_investments: (id: string, metadata: { page: number; pageSize: number }) => {
        let url = `/user/investments/${id}?page=${metadata.page}&pageSize=${metadata.pageSize}`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_session_logs: (id: string, metadata: { page: number; pageSize: number }) => {
    let url = `/user/sessions/${id}?page=${metadata.page}&pageSize=${metadata.pageSize}`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_session_activity_logs: (id: string, metadata: { page: number; pageSize: number }) => {
    let url = `/user/sessions/activities/${id}?page=${metadata.page}&pageSize=${metadata.pageSize}`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_user_kyc_documents: (id: string, metadata: { page: number; pageSize: number }) => {
    let url = `/user/kyc_documents/${id}?page=${metadata.page}&pageSize=${metadata.pageSize}`
    return GATEWAY_ENDPOINT.get(url);
  },
};
