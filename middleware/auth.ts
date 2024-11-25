import { useUser } from "@/composables/auth/user";
const { isLoggedIn } = useUser();
// const isLoggedIn = ref(true)
export default defineNuxtRouteMiddleware((to, from) => {
  if (!isLoggedIn.value && to.path !== "/") {
    return navigateTo("/");
  }
});
