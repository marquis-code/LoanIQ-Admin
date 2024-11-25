import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useRouter } from "vue-router";
import { ref } from "vue";

export const useResetPassword = () => {
  const Router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");
  const { showToast } = useCustomToast();

  const credential = {
    email: ref(""),
    otp: ref(""),
    newPassword: ref("")
  };

  const resetPassword = async () => {
    if (!credential.email.value || !credential.otp.value || !credential.newPassword.value) {
      showToast({
        title: "Error",
        message: "Please fill in all required fields.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    loading.value = true;

    try {
      const res = (await auth_api.$_reset_password({
        email: credential.email.value,
        newPassword: credential.newPassword.value,
        otp: credential.otp.value,
      })) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Reset password reset successfully.",
          toastType: "success",
          duration: 3000,
        });

        Router.push("/");
      } else {
        showToast({
          title: "Error",
          message: res.data.message || "Failed to reset password.",
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

  return { credential, resetPassword, loading, errorMessage };
};
