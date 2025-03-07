import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
    $_get_dashboard_stats: () => {
        let url = `/dashboard/profile`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_analytics: () => {
        let url = `/dashboard/analytics`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_active_investments: (date?: string) => {
        let url = "/dashboard/active-investments";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_total_customer_base: (date?: string) => {
        let url = "/dashboard/users";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_active_users: (date?: string) => {
        let url = "/dashboard/active-users";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_pending_approvals: (date?: string) => {
        let url = "/dashboard/pending-approval-investments";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_liquidatd_investments: (date?: string) => {
        let url = "/dashboard/liquidated-investments";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_total_transactions: (date?: string) => {
        let url = "/dashboard/total-transactions";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_total_wallet_balance: (date?: string) => {
        let url = "/dashboard/total-wallet-balance";
        if (date) url += `?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      }
}
