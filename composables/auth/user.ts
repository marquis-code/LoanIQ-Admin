import { ref, watch, computed, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { decryptData } from "@/api_factory/encrypt-data";

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  token: ref(""),
};

const authObj = ref({});
const decryptedUser = ref({});

// Store encrypted auth data in localStorage
const encryptedAuthData = useStorage("user-auth-data", "");

export const useUser = () => {
  const router = useRouter();

  const id = computed({
    get: () => runtimeData?.user?.value?.id ?? "",
    set: () => {},
  });

  const isLoggedIn = computed({
    get: () => {
      if (!encryptedAuthData?.value) return false;
      return (
        encryptedAuthData.value != null &&
        typeof encryptedAuthData.value === "string"
      );
    },
    set: () => {},
  });

  const logOut = () => {
    // Clear encrypted auth data
    // encryptedAuthData.value = "";
    localStorage.clear();
    // runtimeData.user.value = {};
    // runtimeData.token.value = "";
    authObj.value = {};
    decryptedUser.value = {};
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
      
      // Decrypt and update the user object
      const decrypted = decryptData(encryptedData);
      if (decrypted) {
        authObj.value = decrypted;
        decryptedUser.value = decrypted.user || {};
        localStorage.setItem('user-auth-token', decrypted?.token);
      }
    } catch (error) {
      console.error("Error creating user from encrypted data:", error);
      // logOut(); // Clear data on error
    }
  };

  const updateUser = (userData: any) => {
    try {
      // Update runtime user data
      runtimeData.user.value = userData;
      decryptedUser.value = userData;
      
      // Update the encrypted storage
      if (encryptedAuthData.value) {
        const decrypted = decryptData(encryptedAuthData.value);
        if (decrypted) {
          decrypted.user = userData;
          authObj.value = decrypted;
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
        const decryptedObj = decryptData(encryptedAuthData.value);
        authObj.value = decryptedObj;
        if (decryptedObj && decryptedObj.user) {
          decryptedUser.value = decryptedObj.user;
        }
        return decryptedObj;
      }
      return null;
    } catch (error) {
      console.error("Error getting decrypted auth data:", error);
      return null;
    }
  };

  // Initialize decrypted data when composable is used
  const initializeDecryptedData = () => {
    if (encryptedAuthData.value) {
      getDecryptedAuthData();
    }
  };
  
  // Call initialization immediately
  initializeDecryptedData();

  // Watch for changes in encrypted data
  watch(encryptedAuthData, () => {
    if (encryptedAuthData.value) {
      getDecryptedAuthData();
    } else {
      authObj.value = {};
      decryptedUser.value = {};
    }
  });

  return {
    id,
    isLoggedIn,
    createUser,
    ...runtimeData,
    logOut,
    updateUser,
    setToken,
    getDecryptedAuthData,
    authObj,
    decryptedUser
  };
};