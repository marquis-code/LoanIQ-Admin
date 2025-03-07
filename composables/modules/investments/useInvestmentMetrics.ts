import { ref, onMounted } from 'vue';
import { Wallet, Users, ArrowUpRight, AlertTriangle } from 'lucide-vue-next';

export function useInvestmentMetrics() {
  const metrics = ref([
    {
      id: 1,
      title: 'Total Active Investments',
      value: '$0',
      icon: Wallet,
      trend: 0,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      title: 'Active Clients',
      value: '0',
      icon: Users,
      trend: 0,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      title: 'Average Returns',
      value: '0%',
      icon: ArrowUpRight,
      trend: 0,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      id: 4,
      title: 'Pending Liquidations',
      value: '0',
      icon: AlertTriangle,
      trend: 0,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ]);
  
  const loading = ref(true);
  const error = ref(null);

  const fetchMetrics = async () => {
    loading.value = true;
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/investments/metrics');
      const data = await response.json();
      
      // Update metrics with real data
      metrics.value = [
        {
          id: 1,
          title: 'Total Active Investments',
          value: data.totalActiveInvestments || '$0',
          icon: Wallet,
          trend: data.totalActiveInvestmentsTrend || 0,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          id: 2,
          title: 'Active Clients',
          value: data.activeClients || '0',
          icon: Users,
          trend: data.activeClientsTrend || 0,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
        },
        {
          id: 3,
          title: 'Average Returns',
          value: data.averageReturns || '0%',
          icon: ArrowUpRight,
          trend: data.averageReturnsTrend || 0,
          bgColor: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
        },
        {
          id: 4,
          title: 'Pending Liquidations',
          value: data.pendingLiquidations || '0',
          icon: AlertTriangle,
          trend: data.pendingLiquidationsTrend || 0,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
        },
      ];
    } catch (err) {
      error.value = err;
      console.error('Error fetching investment metrics:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchMetrics);

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
  };
}