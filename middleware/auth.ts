// import { useLogin } from "@/composables/auth/login";
// const { isLoggedIn } = useLogin();
const isLoggedIn = ref(true)
export default defineNuxtRouteMiddleware((to, from) => {
  if (!isLoggedIn.value && to.path !== "/") {
    return navigateTo("/");
  }
});
