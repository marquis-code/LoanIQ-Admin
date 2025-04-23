import { audit_api } from '@/api_factory/modules/audits'

export const useFetchAuditLogs = () => {
    const loading = ref(false);
    const auditLogs = ref<any[]>([]);
    const { $_fetch_audit_logs } = audit_api
  
    const fetchAuditLogs = async () => {
      loading.value = true;
      try {
        const res = await $_fetch_audit_logs() as any
        if (res.type !== 'ERROR') {
          auditLogs.value = res?.data?.data?.auditLogs || [];
        }
      } catch (error) {
        console.error('Error fetching auditLogs:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchAuditLogs()
    })
  
    return { fetchAuditLogs, auditLogs, loading };
  };