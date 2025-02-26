export function useInvestment() {
  // Exchange rate for USD to NGN (Naira)
  const exchangeRate = 750  // 1 USD = 750 NGN

  // Function to format the number as currency in Naira
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'symbol',
    }).format(amount)
  }

  // Function to calculate the return amount based on the investment object
  const calculateReturn = (investment) => {
    // Extract the relevant data from the investment object
    const investmentAmount = parseFloat(investment.amount) // Ensure it's a number
    const investmentRate = parseFloat(investment.investmentRate) // Ensure it's a number (10% -> 10)
    const tenorMonths = parseInt(investment.tenor) // Extract the number of months from the tenor

    // Calculate the return using the formula
    const returnInOriginalCurrency = investmentAmount * (investmentRate / 100) * (tenorMonths / 12)

    // Convert to Naira (NGN) based on the exchange rate
    const returnInNaira = returnInOriginalCurrency * exchangeRate

    // Format the return as money in Naira
    const formattedReturn = formatCurrency(returnInNaira)

    return formattedReturn
  }

  return {
    calculateReturn
  }
}
