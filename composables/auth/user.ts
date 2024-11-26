import { ref, watch } from "vue";
import { useStorage } from "@vueuse/core";
const user = ref(null);

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  permission: ref([] as any),
  token: ref(""),
};
const localStorageData = {
  auth: ref(),
  user: useStorage("user", {} as any),
  token: useStorage("token", ""),
  permission: useStorage('permission', [] as any)
};

watch(
  runtimeData.user,
  (val) => {
    if (val && typeof val === "object") {
      Object.keys(val).forEach((key) => {
        localStorageData.user.value[key] = val[key];
      });
    }
  },
  { deep: true }
);

(() => {
  runtimeData.auth.value = localStorageData.auth.value;
  runtimeData.user.value = localStorageData.user.value;
  runtimeData.token.value = localStorageData.token.value;
  runtimeData.permission.value = localStorageData.permission.value;
})();

export const useUser = () => {
  const id = computed({
    get: () => runtimeData?.auth?.value?.id ?? "",
    set: () => {},
  });


  const isLoggedIn = computed({
    get: () => {
      if (!runtimeData.token?.value) return false;
      return (
        runtimeData?.user?.value != null &&
        typeof runtimeData.user.value === "object"
      );
    },
    set: () => {},
  });

  const isEmailVerified = computed(() => {
    return runtimeData?.user?.value.isEmailVerified;
  });

  const logOut = () => {
    localStorage.clear();
    runtimeData.user.value = null;
  };
                                                                                              
  const setToken = (token: string) => {
    runtimeData.token.value = token;
    localStorageData.token.value = token;
  };
  const createUser = (user: any) => {
    localStorageData.token.value = user?.token;
    localStorageData.permission.value = user?.permission;
    localStorageData.user.value = user?.admin;
    runtimeData.user.value = user?.admin;
    runtimeData.token.value = user?.token;
    runtimeData.permission.value = user?.permission;
  };

  const updateUser = (user: any) => {
    runtimeData.user.value = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorageData.user.value = user;
  };

  return {
    id,
    isLoggedIn,
    isEmailVerified,
    createUser,
    ...runtimeData,
    logOut,
    updateUser,
    setToken
  };
};
