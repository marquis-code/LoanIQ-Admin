import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from '@/composables/core/useCustomToast'

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
    loading.value = true;
    const res = (await auth_api.$_login({
      password: credential.passcode.value,
      email: credential.email.value,
    })) as any;
    loading.value = false;
    if (res.status == 201 || res.status == 200) {
      useUser().createUser(res.data.data);
      showToast({
        title: "Success",
        message: "Login successful",
        toastType: "success",
        duration: 3000
      });
      router.push("/dashboard");
    }
  };
  return { credential, login, loading, isFormDisabled };
};
