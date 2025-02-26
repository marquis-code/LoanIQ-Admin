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
      $_get_dashboard_active_investments: () => {
        let url = `/dashboard/active-investments`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_total_customer_base: (date = 'Today') => {
        let url = `/dashboard/users?filter=${date}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_active_users: () => {
        let url = `/dashboard/active-users`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_pending_approvals: () => {
        let url = `/dashboard/pending-approval-investments`;
        return GATEWAY_ENDPOINT.get(url);
      },
}
