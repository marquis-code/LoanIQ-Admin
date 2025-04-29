import { GATEWAY_ENDPOINT } from "../axios.config";

export const auth_api = {
  $_forgot_password: (payload: { email: string }) => {
    const url = "/auth/forget-password";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_login: (credential: { email: string; password: string }) => {
    const url = "/auth/login";
    return GATEWAY_ENDPOINT.post(url, credential);
  },
  $_reset_password: (credential: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const url = "/auth/create-new-password";
    return GATEWAY_ENDPOINT.post(url, credential);
  },
  $_change_default_password: (credential: {
    userId: any;
    oldPassword: string | Record<string,any>;
    newPassword: string | Record<string,any>;
  }) => {
    const url = "/auth/change-password";
    return GATEWAY_ENDPOINT.post(url, credential);
  },
  $_get_profile: () => {
    let url = "/profile";
    return GATEWAY_ENDPOINT.get(url);
  },
};
