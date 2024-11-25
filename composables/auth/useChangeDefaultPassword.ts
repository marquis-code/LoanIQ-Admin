import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useRouter } from "vue-router";
import { ref } from "vue";

export const useChangeDefaultPassword = () => {
  const Router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");
  const { showToast } = useCustomToast();

  const credential = {
    oldPassword: ref(""),
    newPassword: ref(""),
    userId: ref(""),
  };

  const changeDefaultPassword = async () => {
    if (
      !credential.oldPassword.value ||
      !credential.newPassword.value ||
      !credential.userId.value
    ) {
      showToast({
        title: "Error",
        message: "Please fill in all required fields.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    if (credential.newPassword.value !== credential.oldPassword.value) {
      showToast({
        title: "Error",
        message: "New passwords do not match.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    loading.value = true;

    try {
      const res = (await auth_api.$_change_default_password({
        oldPassword: credential.oldPassword.value,
        newPassword: credential.newPassword.value,
        userId: credential.userId.value,
      })) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Password changed successfully.",
          toastType: "success",
          duration: 3000,
        });

        Router.push("/");
      } else {
        showToast({
          title: "Error",
          message: res.data.message || "Failed to change password.",
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

  return { credential, changeDefaultPassword, loading, errorMessage };
};
