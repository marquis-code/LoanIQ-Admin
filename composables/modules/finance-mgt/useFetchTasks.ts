import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useFetchTasks = () => {
    const loading = ref(false);
    const tasks = ref<any[]>([]);
    const { $_get_all_tasks } = finance_api
  
    const fetchTasks = async () => {
      loading.value = true;
      try {
        const res = await $_get_all_tasks() as any
        if (res.type !== 'ERROR') {
          tasks.value = res?.data?.data?.tasks || [];
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchTasks()
    })
  
    return { fetchTasks, tasks, loading };
  };