import { GATEWAY_ENDPOINT } from "../axios.config";
export const investment_products_api = {
  $_create_investment_product: (payload: Record<string, any>) => {
    let url = '/admin/investment-product';
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_get_investment_products: () => {
    let url = '/admin/investment-product';
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_investment_product: (id: string) => {
    let url = `/admin/investment-product/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_delete_investment_product: (id: string) => {
    let url = `/admin/investment-product/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
};