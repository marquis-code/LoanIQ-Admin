import { useUser } from "@/composables/auth/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useUser();
  const router = useRouter()


  // If the user is logged in and tries to access the login page, redirect to dashboard
  if (isLoggedIn.value && to.path === "/") {
    return router.push("/dashboard"); // Replace '/dashboard' with your dashboard route
  }

  // If the user is not logged in and tries to access any page other than login, redirect to login
  if (!isLoggedIn.value && to.path !== "/") {
    return router.push("/"); // Assuming '/' is the login page
  }
});
