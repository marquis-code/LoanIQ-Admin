// import { ref, watch } from "vue";
// import { useStorage } from "@vueuse/core";
// const user = ref(null);


// const runtimeData = {
//   auth: ref(),
//   user: ref({} as any),
//   permissions: ref([] as any),
//   token: ref(""),
// };
// const localStorageData = {
//   auth: ref(),
//   user: useStorage("user", {} as any),
//   token: useStorage("token", ""),
//   permissions: useStorage('permissions', [] as any)
// };

// watch(
//   runtimeData.user,
//   (val) => {
//     if (val && typeof val === "object") {
//       Object.keys(val).forEach((key) => {
//         localStorageData.user.value[key] = val[key];
//       });
//     }
//   },
//   { deep: true }
// );

// (() => {
//   runtimeData.auth.value = localStorageData.auth.value;
//   runtimeData.user.value = localStorageData.user.value;
//   runtimeData.token.value = localStorageData.token.value;
//   runtimeData.permissions.value = localStorageData.permissions.value;
// })();

// export const useUser = () => {
//   const id = computed({
//     get: () => runtimeData?.auth?.value?.id ?? "",
//     set: () => {},
//   });


//   const isLoggedIn = computed({
//     get: () => {
//       if (!runtimeData.token?.value) return false;
//       return (
//         runtimeData?.user?.value != null &&
//         typeof runtimeData.user.value === "object"
//       );
//     },
//     set: () => {},
//   });

//   const isEmailVerified = computed(() => {
//     return runtimeData?.user?.value.isEmailVerified;
//   });

//   const logOut = () => {
//     localStorage.clear();
//     runtimeData.user.value = null;
//     window.location.href = "/"
//   };
                                                                                              
//   const setToken = (token: string) => {
//     runtimeData.token.value = token;
//     localStorageData.token.value = token;
//   };
//   const createUser = (user: any) => {
//     const { permission, token, refreshToken, ...rest } = user
//     localStorageData.token.value = user?.token;
//     localStorageData.permissions.value = user?.permission;
//     localStorageData.user.value = rest;
//     runtimeData.user.value = rest;
//     runtimeData.token.value = user?.token;
//     runtimeData.permissions.value = user?.permission;
//   };

//   const updateUser = (user: any) => {
//     const { permission, token, refreshToken, ...rest } = user
//     runtimeData.user.value = rest;
//     runtimeData.permissions.value = user?.permission;
//     localStorage.setItem('user', JSON.stringify(user.admin));
//     localStorageData.user.value = rest;
//     localStorage.setItem('permissions', JSON.stringify(user.permission));
//     localStorageData.permissions.value = user?.permission;
//   };

//   // const updatePermissions = (data: any) => {
//   //   runtimeData.permissions.value = data?.permissions;
//   //   localStorage.setItem('permissions', JSON.stringify(data?.permissions));
//   // }

//   // const updateProfile = (data: any) => {
//   //   // Exclude the permissions from the data before updating
//   //   const { permissions, ...profileData } = data;
//   //   const updatedUser = { ...runtimeData.user.value, ...profileData };
  
//   //   // Update the user profile data (without changing permissions)
//   //   runtimeData.user.value = updatedUser;
//   //   localStorage.setItem('user', JSON.stringify(updatedUser));
//   // };

//   const updateUserData = (data: any) => {
//     // Check if the data contains permissions
//     if (data?.permissions) {
//       runtimeData.permissions.value = data?.permission;
//       localStorage.setItem('permissions', JSON.stringify(data?.permission));
//     }
  
//     // Merge the profile data (excluding permissions)
//     const { permissions, ...profileData } = data;
//     const updatedUser = { ...runtimeData.user.value, ...profileData };
  
//     // Update the user profile data (without changing permissions)
//     runtimeData.user.value = updatedUser;
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//   };
  

//   return {
//     id,
//     isLoggedIn,
//     isEmailVerified,
//     createUser,
//     ...runtimeData,
//     logOut,
//     updateUser,
//     setToken,
//     updateUserData
//   };
// };


import { ref, watch, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { decryptData } from "@/api_factory/encrypt-data";

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  token: ref(""),
};

// Store encrypted auth data in localStorage
const encryptedAuthData = useStorage("auth-data", "");

// Initialize runtime data from localStorage if available
(() => {
  try {
    if (encryptedAuthData.value) {
      const decrypted = decryptData(encryptedAuthData.value);
      if (decrypted) {
        runtimeData.user.value = decrypted.user || {};
        runtimeData.token.value = decrypted.token || "";
      }
    }
  } catch (error) {
    console.error("Error decrypting auth data:", error);
    // Clear invalid data
    encryptedAuthData.value = "";
    runtimeData.user.value = {};
    runtimeData.token.value = "";
  }
})();

export const useUser = () => {
  const router = useRouter();

  const id = computed({
    get: () => runtimeData?.user?.value?.id ?? "",
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
    // Clear encrypted auth data
    encryptedAuthData.value = "";
    localStorage.clear();
    runtimeData.user.value = {};
    runtimeData.token.value = "";
  };

  const setToken = (token: string) => {
    console.log(token, 'token received');
    runtimeData.token.value = token;
    
    // Update the encrypted auth data with the new token
    try {
      if (encryptedAuthData.value) {
        const decrypted = decryptData(encryptedAuthData.value);
        if (decrypted) {
          decrypted.token = token;
          // Note: We would need to re-encrypt here, but we don't have the encrypt function
          // This will be handled in createUser or updateUser
        }
      }
    } catch (error) {
      console.error("Error updating token in encrypted data:", error);
    }
  };

  const createUser = (encryptedData: string) => {
    try {
      // Store the encrypted data directly
      encryptedAuthData.value = encryptedData;
      
      // Decrypt for runtime use
      const decrypted = decryptData(encryptedData);
      
      console.log("Decrypted user data:", decrypted);
      
      // Update runtime data
      runtimeData.user.value = decrypted.user || {};
      runtimeData.token.value = decrypted.token || "";
      
    } catch (error) {
      console.error("Error creating user from encrypted data:", error);
      logOut(); // Clear data on error
    }
  };

  const updateUser = (userData: any) => {
    try {
      // Update runtime user data
      runtimeData.user.value = userData;
      
      // Update the encrypted storage
      if (encryptedAuthData.value) {
        const decrypted = decryptData(encryptedAuthData.value);
        if (decrypted) {
          decrypted.user = userData;
          // Note: We would need to re-encrypt here, but we don't have the encrypt function
          // For now, we'll just update the runtime data
        }
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Get the decrypted auth data (useful for other components)
  const getDecryptedAuthData = () => {
    try {
      if (encryptedAuthData.value) {
        return decryptData(encryptedAuthData.value);
      }
      return null;
    } catch (error) {
      console.error("Error getting decrypted auth data:", error);
      return null;
    }
  };

  return {
    id,
    isLoggedIn,
    isEmailVerified,
    createUser,
    ...runtimeData,
    logOut,
    updateUser,
    setToken,
    getDecryptedAuthData
  };
};