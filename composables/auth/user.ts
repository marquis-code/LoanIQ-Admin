// import { ref, watch, computed, onMounted } from "vue";
// import { useStorage } from "@vueuse/core";
// import { useRouter } from "vue-router";
// import { decryptData } from "@/api_factory/encrypt-data";

// const runtimeData = {
//   auth: ref(),
//   user: ref({} as any),
//   token: ref(""),
// };

// const authObj = ref({});
// const decryptedUser = ref({});

// // Store encrypted auth data in localStorage
// const encryptedAuthData = useStorage("user-auth-data", "");

// export const useUser = () => {
//   const router = useRouter();

//   const id = computed({
//     get: () => runtimeData?.user?.value?.id ?? "",
//     set: () => {},
//   });

//   const isLoggedIn = computed({
//     get: () => {
//       if (!encryptedAuthData?.value) return false;
//       return (
//         encryptedAuthData.value != null &&
//         typeof encryptedAuthData.value === "string"
//       );
//     },
//     set: () => {},
//   });

//   const logOut = () => {
//     // Clear encrypted auth data
//     // encryptedAuthData.value = "";
//     localStorage.clear();
//     // runtimeData.user.value = {};
//     // runtimeData.token.value = "";
//     authObj.value = {};
//     decryptedUser.value = {};
//   };

//   const setToken = (token: string) => {
//     console.log(token, 'token received');
//     runtimeData.token.value = token;
    
//     // Update the encrypted auth data with the new token
//     try {
//       if (encryptedAuthData.value) {
//         const decrypted = decryptData(encryptedAuthData.value);
//         if (decrypted) {
//           decrypted.token = token;
//           // Note: We would need to re-encrypt here, but we don't have the encrypt function
//           // This will be handled in createUser or updateUser
//         }
//       }
//     } catch (error) {
//       console.error("Error updating token in encrypted data:", error);
//     }
//   };

//   const createUser = (userObj: string) => {
//     try {
//       // Store the encrypted data directly
//       // encryptedAuthData.value = encryptedData;
      
//       // Decrypt and update the user object
//       // const decrypted = decryptData(encryptedData);
//       if (decrypted) {
//         authObj.value = decrypted;
//         decryptedUser.value = decrypted.user || {};
//         localStorage.setItem('user-auth-token', decrypted?.token);
//       }
//     } catch (error) {
//       console.error("Error creating user from encrypted data:", error);
//       // logOut(); // Clear data on error
//     }
//   };

//   const updateUser = (userData: any) => {
//     try {
//       // Update runtime user data
//       runtimeData.user.value = userData;
//       decryptedUser.value = userData;
      
//       // Update the encrypted storage
//       if (encryptedAuthData.value) {
//         const decrypted = decryptData(encryptedAuthData.value);
//         if (decrypted) {
//           decrypted.user = userData;
//           authObj.value = decrypted;
//           // Note: We would need to re-encrypt here, but we don't have the encrypt function
//           // For now, we'll just update the runtime data
//         }
//       }
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     }
//   };

//   // Get the decrypted auth data (useful for other components)
//   const getDecryptedAuthData = () => {
//     try {
//       if (encryptedAuthData.value) {
//         const decryptedObj = decryptData(encryptedAuthData.value);
//         authObj.value = decryptedObj;
//         if (decryptedObj && decryptedObj.user) {
//           decryptedUser.value = decryptedObj.user;
//         }
//         return decryptedObj;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting decrypted auth data:", error);
//       return null;
//     }
//   };

//   // Initialize decrypted data when composable is used
//   const initializeDecryptedData = () => {
//     if (encryptedAuthData.value) {
//       getDecryptedAuthData();
//     }
//   };
  
//   // Call initialization immediately
//   initializeDecryptedData();

//   // Watch for changes in encrypted data
//   watch(encryptedAuthData, () => {
//     if (encryptedAuthData.value) {
//       getDecryptedAuthData();
//     } else {
//       authObj.value = {};
//       decryptedUser.value = {};
//     }
//   });

//   return {
//     id,
//     isLoggedIn,
//     createUser,
//     ...runtimeData,
//     logOut,
//     updateUser,
//     setToken,
//     getDecryptedAuthData,
//     authObj,
//     decryptedUser
//   };
// };

import { ref, watch } from "vue";
import { useStorage } from "@vueuse/core";
const user = ref(null);

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  token: ref(""),
  // tempOtp: ref(''),
};
const localStorageData = {
  auth: ref(),
  user: useStorage("user", {} as any),
  token: useStorage("token", ""),
  // tempOtp: useStorage('tempOtp', '')
};

const error = ref<string | null>(null);

// Guard against null or undefined runtimeData.user.value
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
})();

export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL as string;

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
    location.href = '/'
  };

  const setToken = (token: string) => {
    runtimeData.token.value = token;
    localStorageData.token.value = token;
  };
  const createUser = (user: any) => {
    runtimeData.user.value = user?.adminDTO;
    localStorageData.token.value = user?.token;
    localStorageData.user.value = user?.adminDTO;
    runtimeData.token.value = user?.token;
  };

  // const updateUser = (user: any) => {
  //   runtimeData.user.value = user;
  //   localStorage.setItem('user', JSON.stringify(user));
  //   localStorageData.user.value = user;
  // };
  const updateUser = (newUser: any) => {
    // Retrieve the existing user data from local storage
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    // Merge the existing user data with the new user data
    const updatedUser = { ...existingUser, ...newUser };
  
    // Update the runtimeData and localStorage with the new user data
    runtimeData.user.value = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorageData.user.value = updatedUser;
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
