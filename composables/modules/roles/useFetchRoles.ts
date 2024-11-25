import { ref } from "vue";
import { roles_api } from "@/api_factory/modules/roles";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchRoles = () => {
  const loading = ref(false);
  const roles = ref([
    // {
    //   id: "f46d6c8f-a8e8-42db-814b-f23886a6c876",
    //   name: "Super Admin",
    //   slug: "super-admin",
    //   description: "",
    // },
    // {
    //   id: "ce4167b6-0275-470f-afbd-6042b3d095d6",
    //   name: "Regular Admin",
    //   slug: "regular-admin",
    //   description: "",
    // },
    // {
    //   id: "815474d2-96cb-43bf-b4a0-1407fe0e51f0",
    //   name: "Moderator",
    //   slug: "moderator",
    //   description: "",
    // },
    // {
    //   id: "fa1a5b64-b66a-4733-8cff-d56cc381c82f",
    //   name: "Content Creator",
    //   slug: "content-creator",
    //   description: "",
    // },
    // {
    //   id: "73dc0ccd-ef49-494a-8406-9331d0434a71",
    //   name: "Support Staff",
    //   slug: "support-staff",
    //   description: "",
    // },
    // {
    //   id: "6e55e731-d1b5-414a-b700-2ee92baad973",
    //   name: "Analyst",
    //   slug: "analyst",
    //   description: "",
    // },
    // {
    //   id: "d4031395-735e-48b1-b081-4fe264783cab",
    //   name: "User Management",
    //   slug: "user-management",
    //   description: "",
    // },
    // {
    //   id: "c7916d00-90cd-44cf-af03-d3cde30b7ff0",
    //   name: "Managing Director Finance",
    //   slug: "managing-director-finance",
    //   description: "",
    // },
    // {
    //   id: "a5b76c2c-ba6d-4b6c-9397-14dbeec759c0",
    //   name: "Accountanct",
    //   slug: "accountanct",
    //   description: "",
    // },
  ] as any[]);
  const { $_get_roles } = roles_api;

  const fetchRoles = async () => {
    loading.value = true;
    try {
      const res = await $_get_roles();
      roles.value = res?.data?.data || [];
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error fetching roles, ${error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchRoles();
  });

  return {
    fetchRoles,
    loading,
    roles,
  };
};
