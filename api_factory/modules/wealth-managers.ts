import { GATEWAY_ENDPOINT } from "../axios.config";
export const wealth_managers_api = {
  $_get_wealth_managers: () => {
    let url = `/staff/wealth-managers`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_assign_wealth_managers_to_investment: (investmentId: string, payload: any) => {
    let url = `/investment/assign-wealth-manager/${investmentId}`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
};

// investments-assigned-to-wealth-manager/:id
