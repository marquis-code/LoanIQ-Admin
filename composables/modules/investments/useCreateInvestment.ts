import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
// import router from "#app/plugins/router";
const { showToast } = useCustomToast();

const payload = ref({
    name: "",
    email: "",
    productId: "",
    principal: '',
    wealthManagerId: "",
    tenor: "",
    // automatedFrequency: "",
    interestRate: "",
    interestPaymentSchedule: "",
    //  paymentMethod: "",
  });

export const useCreateInvestment = () => {
  const loading = ref(false);
  const router = useRouter()
  const createInvestment = async () => {
    loading.value = true;
    const response = (await investment_api.$_create_investment(payload.value)) as any;

    if (response.type !== "ERROR") {
      showToast({
        title: "Success",
        message: "Investment was created successfully.",
        toastType: "success",
        duration: 3000,
      });
      router.push(`/dashboard/investment-mgt/clients`);
      return response.data; // or any data you want to return
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error creating investment"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };


  const setPayload = (data: any) => {
    payload.value.name = data.name
    payload.value.email = data.email
    payload.value.productId = data.productId
    payload.value.principal = data.principal
    payload.value.automatedFrequency = data.automatedFrequency
    payload.value.paymentMethod = data.paymentMethod
    payload.value.interestPaymentSchedule = data.interestPaymentSchedule
  }

  return {
    createInvestment,
    loading,
    payload
  };
};
