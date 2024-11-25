
<template>
   <main class="p-4 lg:px-10 space-y-4 pt-4">
    <div class="">
        <button @click="router.back()" class="bg-gray-100 rounded-full border p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
        </button>
    </div>
    <h5 class="font-semibold text-lg">Create Admin</h5>
    <ModulesAdminsCreate class="lg:w-6/12"/>
   </main>
</template>

<script setup lang="ts">
const router = useRouter()
 definePageMeta({
    layout: 'admin-dashboard'
 })
</script>
