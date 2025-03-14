import { GATEWAY_ENDPOINT } from "../axios.config";
export const wallet_api = {
  $_fetch_wallet_transaction_history: () => {
    let url = '/wallet/transaction-history';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_bank_list: () => {
    let url = '/wallet/get-bank-list';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_resolve_account_number: () => {
    let url = `/wallet/resolve-account/100004/9151886948`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_debit_wallet: (payload: any) => {
    let url = '/wallet/debit-wallet'
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fund_wallet: (payload: any) => {
    let url = '/wallet/fund-wallet'
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_credit_settlement: (payload: any) => {
    let url = '/wallet/credit-settlement-account'
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_authenticate_transfer: (payload: any) => {
    let url = `/check-transfer-status/0001737718567799fde2a8603a2c6a95`
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_check_transfer_status: () => {
    let url = `/check-transfer-status/0001737718567799fde2a8603a2c6a95`
    return GATEWAY_ENDPOINT.get(url);
  },
  $_resend_accout_creation_otp: (payload: any) => {
    let url = `/resend-account-creation-otp`
    return GATEWAY_ENDPOINT.post(url, payload);
  }
};
