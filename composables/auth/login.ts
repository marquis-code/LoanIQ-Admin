import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { decryptData } from "@/api_factory/encrypt-data";

const credential = {
  passcode: ref(""),
  email: ref(""),
};

const resObj = ref({})

const loading = ref(false);

export const useLogin = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();

  const isFormDisabled = computed(() => {
    return (
      loading.value || !credential.passcode.value || !credential.email.value
    );
  });

  const login = async () => {
    loading.value = true;
    try {
      const res = (await auth_api.$_login({
        password: credential.passcode.value,
        email: credential.email.value,
      })) as any;
      resObj.value = res
      console.log(res, 'res here');
      // const decrypted = decryptData(res?.data?.data);
      // console.log(decrypted, 'decrypted data here');
  
      if (res?.data?.data) {
        if (res.status === 201 || res.status === 200) {
          if (res?.data?.data?.statusCode === "CHANGE_DEFAULT_PASSWORD") {
            router.push(`/change-default-password?userId=${res?.data?.data?.userId}`);
          } else {
            useUser().createUser(res.data.data);
            showToast({
              title: "Success",
              message: "Login successful",
              toastType: "success",
              duration: 3000,
            });
  
            if (res?.data?.data?.adminDTO?.roleId === "wealth-manager") {
              router.push(
                `/dashboard/wealth-managers/${res?.data?.data?.adminDTO?.id}/investments`
              );
            } else {
              router.push("/dashboard");
              window.location.href = "/dashboard"
            }
          }
        }
      }
    } catch (error) {
      // console.error("Login error:", res, );
      showToast({
        title: "Error",
        message: resObj?.value?.data?.message,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };
  
  return { credential, login, loading, isFormDisabled };
};
