import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetKycDocuments = () => {
    const loading = ref(false);
    const documents = ref([]);
    const metadata = ref({
        page: 1,
        pageSize: 7,
        total: 0,
        pages: 0,
      });
    const { $_get_user_kyc_documents } = users_api;
    const route = useRoute()
  
    const getKycDocuments = async () => {
      const id = route.params.id as string
      loading.value = true;
      try {
        const response = await $_get_user_kyc_documents(id, metadata.value) as any
        if (response.type !== "ERROR") {
          console.log(response?.data?.data, 'fghjkl')
          const { page, pageSize, total, pages } = response?.data?.data || {};
          metadata.value = { page, pageSize, total, pages };
          documents.value = response?.data?.data?.kyc_documents ?? [];
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error retrieving user details'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while retrieving documents details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      getKycDocuments()
    })

    watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
        () => {
            getKycDocuments()
        }
    );
  
    return {
      getKycDocuments,
      documents,
      loading,
    };
  };
  