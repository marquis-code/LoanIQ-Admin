// composables/useCurrencyFormatter.ts
export const useCurrencyFormatter = (locale = 'en-NG', currency = 'NGN') => {
    const formatCurrency = (amount: number | null | undefined): string => {
      if (amount === null || amount === undefined) return '';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    };
  
    return {
      formatCurrency,
    };
  };
  