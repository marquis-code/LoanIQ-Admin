import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";

const credential = {
  passcode: ref(""),
  email: ref(""),
};

export const useLogin = () => {
  const router = useRouter();
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const isFormDisabled = computed(() => {
    return (
      loading.value || !credential.passcode.value || !credential.email.value
    );
  });

  const login = async () => {
    const router = useRouter();
    loading.value = true;
    const res = (await auth_api.$_login({
      password: credential.passcode.value,
      email: credential.email.value,
    })) as any;
    console.log(
      res.data.data.statusCode === "CHANGE_DEFAULT_PASSWORD",
      "res here"
    );
    loading.value = false;
    if (res.status == 201 || res.status == 200) {
      if (res.data.data.statusCode === "CHANGE_DEFAULT_PASSWORD") {
        router.push(
          `/change-default-password?userId=${res?.data?.data?.userId}`
        );
      } else {
        console.log(res, "res here");
        useUser().createUser(res.data.data);
        showToast({
          title: "Success",
          message: "Login successful",
          toastType: "success",
          duration: 3000,
        });
        if (res.data.data.roleId === "wealth-manager") {
          router.push(
            `/dashboard/wealth-managers/${res?.data?.data?.id}/investments`
          );
        } else {
          window.location.href = "/dashboard";
          router.push("/dashboard");
        }
      }
    }
  };
  return { credential, login, loading, isFormDisabled };
};
