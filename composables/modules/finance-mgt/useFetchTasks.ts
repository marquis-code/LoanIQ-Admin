// import { finance_api } from '@/api_factory/modules/finance-mgt'

// export const useFetchTasks = () => {
//     const loading = ref(false);
//     const tasks = ref<any[]>([]);
//     const { $_get_all_tasks } = finance_api

//     const metadata = ref({
//       page: 1,
//       pageSize: 10,
//       totalPages: 10,
//       total: 10
//     })
  
//     const fetchTasks = async () => {
//       loading.value = true;
//       try {
//         const res = await $_get_all_tasks(metadata.value) as any
//         if (res.type !== 'ERROR') {
//           // const { ...rest, tasks } = res?.data?.data
//           tasks.value = res?.data?.data?.tasks || [];
//           metadata.value = { ...res?.data?.data }
//         }
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//       } finally {
//         loading.value = false;
//       }
//     };

//     onMounted(() => {
//       fetchTasks()
//     })
  
//     return { fetchTasks, tasks, loading, metadata, ...metadata.value };
//   };

import { finance_api } from '@/api_factory/modules/finance-mgt'
import { ref, onMounted, watch } from 'vue';

export const useFetchTasks = () => {
  const loading = ref(false);
  const tasks = ref<any[]>([]);
  const { $_get_all_tasks } = finance_api;

  const metadata = ref({
    page: 1,
    pageSize: 100,
    totalPages: 1,
    total: 0
  });

  const fetchTasks = async () => {
    loading.value = true;
    try {
      const res = await $_get_all_tasks({ 
        page: metadata.value.page, 
        pageSize: metadata.value.pageSize 
      }) as any;

      if (res.type !== 'ERROR') {
        tasks.value = res?.data?.data?.tasks || [];

        // Only update total-related metadata to avoid triggering watch
        metadata.value.totalPages = res?.data?.data?.totalPages ?? metadata.value.totalPages;
        metadata.value.total = res?.data?.data?.total ?? metadata.value.total;
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      loading.value = false;
    }
  };

  // // Initial fetch
  // onMounted(() => {
  //   fetchTasks();
  // });

  // Watch page and pageSize changes only
  watch(
    () => [metadata.value.page, metadata.value.pageSize],
    () => {
      fetchTasks();
    },
    { deep: false }
  );

  return { fetchTasks, tasks, loading, ...metadata.value, metadata };
};
