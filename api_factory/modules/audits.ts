import { GATEWAY_ENDPOINT } from "../axios.config";
export const audit_api = {
  $_fetch_audit_logs: () => {
    let url = `/audits/audit-logs`;
    return GATEWAY_ENDPOINT.get(url);
  }
}