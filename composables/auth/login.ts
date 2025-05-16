import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { decryptData } from "@/api_factory/encrypt-data";

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
    console.log(res, 'res here')
    const decrypted = decryptData(res?.data?.data);
    console.log(decrypted, 'res here')
    loading.value = false;
    if(decrypted){
      if (res.status == 201 || res.status == 200) {
        if (decrypted.statusCode === "CHANGE_DEFAULT_PASSWORD") {
          router.push(
            `/change-default-password?userId=${decrypted?.userId}`
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
          if (decrypted?.adminDTO?.roleId === "wealth-manager") {
            router.push(
              `/dashboard/wealth-managers/${decrypted?.adminDTO?.id}/investments`
            );
          } else {
            // window.location.href = "/dashboard";
            router.push("/dashboard");
          }
        }
      }
    }
  };
  return { credential, login, loading, isFormDisabled };
};
