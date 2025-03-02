import { GATEWAY_ENDPOINT } from "../axios.config";

export const kyc_api = {
  $_validate_nin: (payload: { nin: string }) => {
    const url = "/validate-nin";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_validate_bvn:  (payload: { bvn: string }) => {
    let url = "/validate-bvn";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_validate_phone:  (payload: { phoneNumber: string}) => {
    let url = "/validate-phone-number";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
};
