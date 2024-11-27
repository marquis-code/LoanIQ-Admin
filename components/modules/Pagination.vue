<template>
  <div class="flex justify-center items-center mt-4 space-x-2">
    <button
        @click="updatePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded"
    >
      Prev
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
        @click="updatePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update-page"]);

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.itemsPerPage)
);

function updatePage(newPage: number) {
  if (newPage > 0 && newPage <= totalPages.value) {
    emit("update-page", newPage);
  }
}
</script>
