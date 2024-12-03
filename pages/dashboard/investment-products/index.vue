<template>
<main v-if="canView('investment-product')"  class="">
  <ModulesInvestmentList :loading="loading" :products="investmentProducts" @selected="handleSelected" />
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
  investmentProducts } = useFetchInvestmentProducts()
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
    console.log('here')
    openDrawer.value = false
  }
</script>
