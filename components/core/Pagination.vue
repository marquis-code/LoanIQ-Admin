<template>
  <main class="">
    <nav
      class="flex items-center justify-between border-t border-gray-100 border-x px-4 sm:px-3 border-b rounded-b-lg p-2.5">
      <div class="-mt-px flex w-0 flex-1">
        <button @click.prevent="previousPage" :disabled="currentPage === 1"
          class="l-6 rounded-md px-6 py-2.5 border flex justify-center items-center pr-4  text-sm disabled:cursor-not-allowed disabled:opacity-50 font-medium text-gray-500  hover:text-gray-700">
          Previous
        </button>
      </div>
      <div class="hidden md:-mt-px md:flex">
        <button v-for="page in pageNumbers" :key="page" @click="changePage(page)"
          :class="['px-6 py-2 rounded font-semibold', currentPage === page ? 'bg-[#5B8469] text-white' : 'text-gray-500']">
          {{ page }}
        </button>
        <!-- <button v-for="item in 10" :key="item">{{ item }}</button> -->
      </div>
      <div class="-mt-px flex w-0 flex-1 justify-end">
       <div class="px-6">
        <button @click.prevent="nextPage" :disabled="currentPage === totalPages"
        class="bg-[#292929] pl-6 rounded-md px-6 py-2.5 text-white disabled:opacity-50 flex justify-center items-center disabled:cursor-not-allowed  text-sm font-medium">
        Next
      </button>
       </div>
      </div>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

interface Props {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['page-changed']);

const currentPage = computed(() => props.page);
const totalPages = computed(() => props.pages);

const pageNumbers = computed(() => {
  const maxPagesToShow = 5;
  const halfRange = Math.floor(maxPagesToShow / 2);
  let startPage = Math.max(1, currentPage.value - halfRange);
  let endPage = Math.min(totalPages.value, currentPage.value + halfRange);

  if (currentPage.value - startPage < halfRange) {
    endPage = Math.min(totalPages.value, endPage + (halfRange - (currentPage.value - startPage)));
  }

  if (endPage - currentPage.value < halfRange) {
    startPage = Math.max(1, startPage - (halfRange - (endPage - currentPage.value)));
  }

  const pagesArray = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesArray.push(i);
  }

  return pagesArray;
});

const changePage = (page: number) => {
  emit('page-changed', page);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1);
  }
};
</script>