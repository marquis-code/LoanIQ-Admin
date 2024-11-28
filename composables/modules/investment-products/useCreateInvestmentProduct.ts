import { ref } from "vue";
import { investment_products_api } from "@/api_factory/modules/investments_products";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
  name: "",
  image: "",
  description:
    "",
  benefits: [],
  minInvestment: "",
  interestRate: "",
  minTenor: "",
  maxTenor: "",
  flexible: true,
  canTopUp: true,
  canWithdrawEarly: true,
  preLiquidationFee: "",
  interestPaymentSchedule: [], // upfront, monthly, after-maturity
  automatedFrequency: [] // one-off, daily, weekly, monthly
});

export const useCreateInvestmentProduct = () => {
  const loading = ref(false);
  const router = useRouter()
  const { $_create_investment_product } = investment_products_api;

  const createInvestmentProduct = async () => {
    loading.value = true;
    const res = await $_create_investment_product(payload.value) as any
    if(res.type !== 'ERROR'){
      showToast({
        title: "Success",
        message: "Investment product was created successfully.",
        toastType: "success",
        duration: 3000,
      });
      router.push('/dashboard/investment-products')
    } else {
      showToast({
        title: "Error",
        message: res?.data?.message,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  return {
    createInvestmentProduct,
    loading,
    payload
  };
};
