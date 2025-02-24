import { GATEWAY_ENDPOINT } from "../axios.config";
export const admin_api = {
  $_create_admin: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
  }) => {
    let url = "/create";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_admins: (metadata: { page: number; pageSize: number }) => {
    let url = `/?page=${metadata.page}&pageSize=${metadata.pageSize}`;
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
  },
};
