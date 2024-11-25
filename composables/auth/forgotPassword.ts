import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useForgotPassword = () => {
  const Router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");
  const { showToast } = useCustomToast();

  const credential = {
    email: ref(""),
  };

  const forgotPassword = async () => {
    if (!credential.email.value) {
      showToast({
        title: "Error",
        message: "No email available",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    loading.value = true;

    try {
      const res = (await auth_api.$_forgot_password({
        email: credential.email.value,
      })) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Forgot password email sent successfully.",
          toastType: "success",
          duration: 3000,
        });

        Router.push("/reset-password");
      } else {
        showToast({
          title: "Error",
          message: res.data.message || "Failed to set pin",
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      loading.value = false;
      showToast({
        title: "Error",
        message: error?.message || "An unexpected error occurred.",
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return { credential, forgotPassword, loading, errorMessage };
};
