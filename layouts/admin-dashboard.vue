<template>
  <div>
    <!-- {{decryptedUser?.adminDTO?.roleId}} -->
    <div
      v-if="isOpen"
      class="relative z-50 xl:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-900/80" aria-hidden="true"></div>

      <div class="fixed inset-0 flex">
        <div class="relative mr-16 flex w-full max-w-xs flex-1">
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button @click="isOpen = false" type="button" class="-m-2.5 p-2.5">
              <span class="sr-only">Close sidebar</span>
              <X class="h-6 w-6 text-white" />
            </button>
          </div>

          <div
            class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10"
          >
            <div class="flex h-16 shrink-0 items-center">
              <img
                class="h-8 w-auto"
                src="@/assets/img/logo.png"
                alt="Your Company"
              />
            </div>
            <nav class="flex flex-1 flex-col">
              <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" class="-mx-2 space-y-1">
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Home class="h-6 w-6 shrink-0" />
                        Home
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/users-mgt"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Users class="h-6 w-6 shrink-0" />
                        User Management
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/audit-trail"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Users class="h-6 w-6 shrink-0" />
                        Audit Trail
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/tasks"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <ClipboardDocumentListIcon class="h-6 w-6 shrink-0" />
                        Tasks Management
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/wealth-managers"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Users class="h-6 w-6 shrink-0" />
                        Wealth Managers
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/admin"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <ShieldCheck class="h-6 w-6 shrink-0" />
                        Admin Management
                      </NuxtLink>
                    </li>
                    <!-- <li>
                      <NuxtLink
                        @click="closeSidebar"
                        to="/dashboard/investments"
                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <TrendingUp class="h-6 w-6 shrink-0" />
                        Investments
                      </NuxtLink>
                    </li> -->
                    <NuxtLink
                      @click="closeSidebar"
                      to="/dashboard/roles-permissions"
                      class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <KeyRound class="h-6 w-6 shrink-0" />
                      Roles & Permissions
                    </NuxtLink>
                  </ul>
                </li>

                <li class="-mx-6 mt-auto">
                  <a
                    @click="openLogoutModal = true"
                    href="#"
                    class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                  >
                    <LogOut class="h-5 w-5" />
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden xl:fixed xl:inset-y-0 xl:z-50 bg-gray-900 xl:flex xl:w-72 xl:flex-col"
    >
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="@/assets/img/logo.png"
            alt="Your Company"
          />
        </div>
        <!-- v-if="user.roleId === 'super-admin'" -->
        <nav v-if="decryptedData?.adminDTO?.roleId === 'super-admin'" class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-if="hasPermission('dashboard')">
                  <NuxtLink
                    to="/dashboard"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Home class="h-6 w-6 shrink-0" />
                    Home
                  </NuxtLink>
                </li>
                <!-- <li v-if="hasPermission('investment-product')">
                  <NuxtLink
                    to="/dashboard/investment-products"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <LineChart class="h-6 w-6 shrink-0" />
                    Investment Products
                  </NuxtLink>
                </li> -->
                <li v-if="hasPermission('user-management')">
                  <NuxtLink
                    to="/dashboard/users-mgt"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Users class="h-6 w-6 shrink-0" />
                    User Management
                  </NuxtLink>
                </li>
                <div
                  class="relative"
                  v-if="hasPermission('roles-and-permission')"
                >
                  <button
                    @click="isOpenReferralDropdown = !isOpenReferralDropdown"
                    class="group flex w-full items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    :class="{ 'bg-gray-800 text-white': isOpenReferralDropdown }"
                  >
                    <div class="flex items-center gap-x-3">
                      <Wallet class="h-6 w-6 shrink-0" />
                      <span>Referral Campaign</span>
                    </div>
                    <ChevronDownIcon
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-180': isOpenReferralDropdown }"
                    />
                  </button>

                  <TransitionRoot appear :show="isOpenReferralDropdown" as="template">
                    <div
                      class="absolute left-0 mt-1 w-full min-w-[200px] origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                      <TransitionChild
                        as="template"
                        enter="transition ease-out duration-200"
                        enter-from="opacity-0 translate-y-1"
                        enter-to="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leave-from="opacity-100 translate-y-0"
                        leave-to="opacity-0 translate-y-1"
                      >
                        <div class="py-1">
                          <NuxtLink
                            v-for="item in referralMenuItems"
                            :key="item.path"
                            :to="item.path"
                            @click="isOpenReferralDropdown = !isOpenReferralDropdown"
                            class="group flex items-center gap-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <component
                              :is="item.icon"
                              class="h-5 w-5"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </NuxtLink>
                        </div>
                      </TransitionChild>
                    </div>
                  </TransitionRoot>
                </div>


                <div
                  class="relative mt-2"
                  v-if="hasPermission('roles-and-permission')"
                >
                  <button
                    @click="toggleInvestmentDropdown"
                    class="group flex w-full items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    :class="{ 'bg-gray-800 text-white': isInvestmentOpenDropdown }"
                  >
                    <div class="flex items-center gap-x-3">
                      <BarChart3 class="h-6 w-6 shrink-0" />
                      <span>Investment Management</span>
                    </div>
                    <ChevronDownIcon
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-180': isInvestmentOpenDropdown }"
                    />
                  </button>

                  <TransitionRoot appear :show="isInvestmentOpenDropdown" as="template">
                    <div
                      class="absolute left-0 mt-1 w-full min-w-[200px] origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                      <TransitionChild
                        as="template"
                        enter="transition ease-out duration-200"
                        enter-from="opacity-0 translate-y-1"
                        enter-to="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leave-from="opacity-100 translate-y-0"
                        leave-to="opacity-0 translate-y-1"
                      >
                        <div class="py-1">
                          <NuxtLink
                            v-for="item in investmentMenuItems"
                            :key="item.path"
                            :to="item.path"
                            @click="closeInvestmentDropdown"
                            class="group flex items-center gap-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <component
                              :is="item.icon"
                              class="h-5 w-5"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </NuxtLink>
                        </div>
                      </TransitionChild>
                    </div>
                  </TransitionRoot>
                </div>

                <div
                  class="relative"
                  v-if="hasPermission('roles-and-permission')"
                >
                  <button
                    @click="toggleDropdown"
                    class="group flex w-full items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    :class="{ 'bg-gray-800 text-white': isOpenDropdown }"
                  >
                    <div class="flex items-center gap-x-3">
                      <Wallet class="h-6 w-6 shrink-0" />
                      <span>Finance Management</span>
                    </div>
                    <ChevronDownIcon
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-180': isOpenDropdown }"
                    />
                  </button>

                  <TransitionRoot appear :show="isOpenDropdown" as="template">
                    <div
                      class="absolute left-0 mt-1 w-full min-w-[200px] origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    >
                      <TransitionChild
                        as="template"
                        enter="transition ease-out duration-200"
                        enter-from="opacity-0 translate-y-1"
                        enter-to="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leave-from="opacity-100 translate-y-0"
                        leave-to="opacity-0 translate-y-1"
                      >
                        <div class="py-1">
                          <NuxtLink
                            v-for="item in menuItems"
                            :key="item.path"
                            :to="item.path"
                            @click="closeDropdown"
                            class="group flex items-center gap-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <component
                              :is="item.icon"
                              class="h-5 w-5"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </NuxtLink>
                        </div>
                      </TransitionChild>
                    </div>
                  </TransitionRoot>
                </div>

                <li v-if="hasPermission('user-management')">
                  <NuxtLink
                    to="/dashboard/tasks"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <ClipboardDocumentListIcon class="h-6 w-6 shrink-0" />
                    Tasks Management
                  </NuxtLink>
                </li>
                <li v-if="hasPermission('user-management')">
                  <NuxtLink
                    to="/dashboard/wealth-managers"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Users class="h-6 w-6 shrink-0" />
                   Wealth Managers
                  </NuxtLink>
                </li>
                <li v-if="hasPermission('admin-management')">
                  <NuxtLink
                    to="/dashboard/admin"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <ShieldCheck class="h-6 w-6 shrink-0" />
                    Admin Management
                  </NuxtLink>
                </li>
                <li v-if="hasPermission('user-management')">
                  <NuxtLink
                    to="/dashboard/audit-trail"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Users class="h-6 w-6 shrink-0" />
                    Audit Trail
                  </NuxtLink>
                </li>
                <!-- <li v-if="hasPermission('investment')">
                  <NuxtLink
                    to="/dashboard/investments"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <TrendingUp class="h-6 w-6 shrink-0" />
                    Investments
                  </NuxtLink>
                </li> -->

                <li v-if="hasPermission('roles-and-permission')">
                  <NuxtLink
                    to="/dashboard/roles-permissions"
                    class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <KeyRound class="h-6 w-6 shrink-0" />
                    Roles & Permissions
                  </NuxtLink>
                </li>
              <!-- Referral -->
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a
                @click="openLogoutModal = true"
                href="#"
                class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
              >
                <LogOut class="h-5 w-5" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>

        <div v-if="decryptedData?.adminDTO?.roleId === 'wealth-manager'">
          <button
            class="group w-full disabled:cursor-not-allowed disabled:opacity-25 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Users class="h-6 w-6 shrink-0" />
            Wealth Manager
          </button>

          <div class="-mx-6 mt-auto">
              <button
                @click="openLogoutModal = true"
                class="flex items-center w-full gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
              >
                <LogOut class="h-5 w-5" />
                <span>Logout</span>
              </button>
          </div>
        </div>
      </div>
    </div>

    <div class="xl:pl-72">
      <!-- sticky top-0 -->
      <div
        class="z-40 flex h-16 shrink-0  items-center gap-x-6 border-b border-white/5 px-4 shadow-sm sm:px-6 lg:px-8"
      >
        <button
          @click="isOpen = true"
          type="button"
          class="-m-2.5 p-2.5 text-white xl:hidden"
        >
          <span class="sr-only">Open sidebar</span>
          <Menu class="h-5 w-5" />
        </button>
          <AdminHeader />
        <!-- <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="flex flex-1" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="relative w-full">
              <Search class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500" />
              <input
                id="search-field"
                class="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </div>
          </form>
        </div> -->
      </div>

      <!-- {{decryptedData?.adminDTO?.roleId}} -->
      <slot />
      <VerificationSidebar v-model="isVerificationOpen" />
    </div>
  </div>

  <ModalsConfirm
    @close="openLogoutModal = false"
    @continue="handleLogout"
    :loading="false"
    title="Logout"
    description="Are you sure you want to logout ?"
    :show="openLogoutModal"
  />
</template>

<script setup lang="ts">
const isOpen = ref(false);
import { useUser } from "@/composables/auth/user";
import { usePermissions } from "@/composables/core/usePermissions";
import {
  Briefcase,
  Building2,
  Users,
  Menu,
  X,
  Home,
  LineChart,
  ShieldCheck,
  TrendingUp,
  KeyRound,
  Wallet,
  BarChart3,
  Search,
  LogOut
} from 'lucide-vue-next'
const { hasPermission } = usePermissions();
import { useCustomToast } from "@/composables/core/useCustomToast";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import {
  ChevronDownIcon,
  ChartBarIcon,
  BanknotesIcon,
  FlagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";
const { showToast } = useCustomToast();
const { getDecryptedAuthData, user, decryptedUser } = useUser()
// const { permission: permissions } = getDecryptedAuthData()

const decryptedData = getDecryptedAuthData();
const permissions = ref([]);

// Safely assign permissions if they exist
if (decryptedData && decryptedData.permission) {
  permissions.value = decryptedData.permission;
}

// else if (authObj.value && authObj.value.permission) {
//   permissions.value = authObj.value.permission;
// }

const router = useRouter();

const userDropdownOpen = ref(false);

function toggleUserDropdown() {
  userDropdownOpen.value = !userDropdownOpen.value;
}

const openLogoutModal = ref(false);

const handleLogout = async () => {
  localStorage.clear();
  window.location.href = "/";
  showToast({
    title: "Success",
    message: "You have been logged out successfully",
    toastType: "success",
    duration: 3000,
  });
};

const closeSidebar = () => {
  isOpen.value = !isOpen.value;
};
const openInvestmentsTabs = ref(false);

interface MenuItem {
  name: string;
  path: string;
  icon: any;
}

const isOpenDropdown = ref(false);
const isOpenReferralDropdown = ref(false)
const isInvestmentOpenDropdown = ref(false);

const menuItems: MenuItem[] = [
  {
    name: "Transactions",
    path: "/dashboard/finance/transactions",
    icon: BanknotesIcon,
  },
  {
    name: "Compaany Portfolio",
    path: "/dashboard/finance/revenue-streams",
    icon: ChartBarIcon,
  },
  {
    name: "Wallet Management",
    path: "/dashboard/finance/wallet",
    icon: FlagIcon,
  },
  // {
  //   name: "Tasks",
  //   path: "/dashboard/finance/tasks",
  //   icon: ClipboardDocumentListIcon,
  // },
];

const referralMenuItems = ref([
{
    name: "Referral",
    path: "/dashboard/referral/",
    icon: BanknotesIcon,
  },
  {
    name: "Analytics",
    path: "/dashboard/referral/analytics",
    icon: ChartBarIcon,
  }
])

const toggleDropdown = () => {
  isOpenDropdown.value = !isOpenDropdown.value;
  // Close the other dropdown if it's open
  if (isInvestmentOpenDropdown.value) {
    isInvestmentOpenDropdown.value = false;
  }
};

const closeDropdown = () => {
  isOpenDropdown.value = false;
};

const toggleInvestmentDropdown = () => {
  isInvestmentOpenDropdown.value = !isInvestmentOpenDropdown.value;
  // Close the other dropdown if it's open
  if (isOpenDropdown.value) {
    isOpenDropdown.value = false;
  }
};

const closeInvestmentDropdown = () => {
  isInvestmentOpenDropdown.value = false;
};

// Add click outside handler to close dropdown
onMounted(() => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      isOpenDropdown.value = false;
      isInvestmentOpenDropdown.value = false;
    }
  });
});

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener("click", () => {});
});

const route = useRoute()

const investmentMenuItems: MenuItem[] = [
  {
    name: 'Product Management',
    path: '/dashboard/investment-mgt/products',
    icon: Briefcase
  },
  {
    name: 'Client Investments',
    path: '/dashboard/investment-mgt/clients',
    icon: Users
  },
  // {
  //   name: 'Company Portfolio',
  //   path: '/dashboard/investment-mgt/portfolio',
  //   icon: Building2
  // }
]

const currentPage = computed(() => {
  const current = navigation.find(item => route.path.startsWith(item.path))
  return current?.name || 'Dashboard'
})

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped>
.router-link-exact-active {
  background-color: #fff2f2;
  color: #2f6d67;
}
</style>