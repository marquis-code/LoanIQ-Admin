import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
    $_get_dashboard_stats: () => {
        let url = `/dashboard/profile`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_dashboard_analytics: () => {
        let url = `/admin/dashboard/analytics`;
        return GATEWAY_ENDPOINT.get(url);
      }
}
