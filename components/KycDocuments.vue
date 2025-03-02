<template>
    <main>
        <div v-if="kycDocuments?.length && !loadingDocuments" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="document in kycDocuments" :key="document.id" class="rounded-lg border p-4">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="font-medium">{{ document.idType }}</h4>
                <span :class="{
                  'bg-green-100 text-green-800':
                    document.status === 'approved',
                  'bg-yellow-100 text-yellow-800':
                    document.status === 'pending',
                  'bg-red-100 text-red-800': document.status === 'rejected',
                }" class="rounded-full px-2 py-1 text-xs font-medium">
                  {{ document.status }}
                </span>
              </div>
              <div class="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100 relative group">
                <div
                  class="h-full w-full transition-transform duration-500 transform preserve-3d group-hover:rotate-y-180">
                  <!-- Front Side -->
                  <img :src="document.documentFrontCopy || placeholderImage" :alt="document.type"
                    class="absolute inset-0 h-full w-full object-cover backface-hidden" />
                  <!-- Back Side -->
                  <img :src="document.documentBackCopy || placeholderImage" :alt="document.type"
                    class="absolute inset-0 h-full w-full object-cover backface-hidden rotate-y-180" />
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="reviewDocument(document)"
                  class="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  Review
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="!kycDocuments?.length && !loadingDocuments"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No KYC Documents Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
    </main>
</template>

<script setup lang="ts">
import moment from "moment";
import placeholderImage from "@/assets/icons/document.svg"
import { useGetKycDocuments } from "@/composables/modules/users/useFetchKycDocuments";
const { documents: kycDocuments, loading: loadingDocuments } = useGetKycDocuments();
</script>