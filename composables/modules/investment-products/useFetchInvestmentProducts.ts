import { ref, onMounted } from "vue";
import { investment_products_api } from "@/api_factory/modules/investments_products";
import { useCustomToast } from "@/composables/core/useCustomToast";

const { showToast } = useCustomToast();

export const useFetchInvestmentProducts = () => {
  const loading = ref(false);
  const investmentProducts = ref([] as any[]);
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });

  const { $_get_investment_products } = investment_products_api;

  const fetchInvestmentProducts = async () => {
    loading.value = true;
    try {
      const response = await $_get_investment_products(metadata.value);
      const { investmentProducts: products, page, pageSize, total, pages } = response?.data?.data || {};
      
      investmentProducts.value = products || [];
      metadata.value = { page, pageSize, total, pages };
    } catch (error: any) {
      showToast({
        title: "Error",
        message: `Error fetching investment products: ${error.message || error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        // debouncedGetProperties(); // Use the debounced version here
        fetchInvestmentProducts()
    }
);

  onMounted(fetchInvestmentProducts);

  return {
    fetchInvestmentProducts,
    loading,
    investmentProducts,
    metadata
  };
};
