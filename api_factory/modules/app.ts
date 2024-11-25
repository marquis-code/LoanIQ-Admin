import { GATEWAY_ENDPOINT } from "../axios.config";
export const app_api = {
  $_create_app_module: (payload: Record<string, any>) => {
    let url = '/module';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_edit_roles: (id: string, payload: Record<string, any>) => {
    let url = `/module/${id}`;
    return GATEWAY_ENDPOINT.put(url, payload);
  },
  $_delete_module: (id: string) => {
    let url = `/admin/module/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
  $_get_app_modules: () => {
    let url = '/module'
    return GATEWAY_ENDPOINT.get(url);
  }
};
