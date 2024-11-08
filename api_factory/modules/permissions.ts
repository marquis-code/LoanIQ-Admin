import { GATEWAY_ENDPOINT } from "../axios.config";
export const permissions_api = {
  $_create_permissions: (payload: Record<string, any>) => {
    let url = '/permission';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_permissions: () => {
    let url = '/permission';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_edit_permissions: (id: string, payload: Record<string, any>) => {
    let url = `/permission/${id}`;
    return GATEWAY_ENDPOINT.get(url, payload);
  },
  $_delete_permissions: (id: string) => {
    let url = `/permission/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
};
