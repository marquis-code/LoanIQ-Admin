<template>
<main v-if="canView('investment-product')"  class="">
  <ModulesInvestmentList :loading="loading" :products="investmentProducts" @selected="handleSelected" />
   <div class="px-7">
    <CorePagination
    v-if="!loading && investmentProducts.length > 0"
    :total="metadata.total"
    :page="metadata.page"
    :perPage="metadata.pageSize"
    :pages="metadata.pages"
    @page-changed="handlePageChange"
  />
   </div>
    <CoreDrawer :showFooter="false" title="Investment Details" description="Below are investment details" :show="openDrawer" @close="closeDrawer">
        <template #content>
            <ModulesInvestmentDetails :investment="selectedInvestment" />
        </template>
    </CoreDrawer>
</main>
</template>

<script setup lang="ts">
import { usePermissions } from '@/composables/core/usePermissions'
const { canView } = usePermissions()
import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts'
const { loading,
  investmentProducts, metadata } = useFetchInvestmentProducts()
  definePageMeta({
          layout: 'admin-dashboard',
          middleware: 'auth',
      })

  const openDrawer = ref(false)
  const selectedInvestment = ref({})

  const handleSelected = (data: any) => {
    selectedInvestment.value = data
    openDrawer.value = true
  }

  const closeDrawer = () => {
    openDrawer.value = false
  }

  const handlePageChange = (page: number) => {
  metadata.value.page = page
}
</script>
