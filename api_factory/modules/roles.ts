import { GATEWAY_ENDPOINT } from "../axios.config";
export const roles_api = {
  $_create_roles: (payload: Record<string, any>) => {
    let url = '/admin/role';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_roles: () => {
    let url = '/admin/role';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_edit_roles: (id: string, payload: Record<string, any>) => {
    let url = `/admin/role/${id}`;
    return GATEWAY_ENDPOINT.get(url, payload);
  },
  $_delete_roles: (id: string) => {
    let url = `/admin/role/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
};
