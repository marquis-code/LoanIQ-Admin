import { GATEWAY_ENDPOINT } from "../axios.config";
export const admin_api = {
  $_create_admin: (payload: Record<string, any>) => {
    let url = '/create';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_admins: () => {
    let url = '/';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_admin: (id: string) => {
    let url = `/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_delete_admin: (id: string) => {
    let url = `/delete/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
  $_block_admins: (id: string) => {
    let url = `/block/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  }
};
