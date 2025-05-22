export const parseCurrencyToNumber = (currencyString) => {
    if (typeof currencyString !== 'string' || !currencyString.trim()) return 0;
  
    // Remove currency symbol and commas, then parse as a number
    const sanitizedString = currencyString.replace(/[₦,\s]/g, ''); // Remove ₦, commas, and spaces
    const parsedNumber = parseInt(sanitizedString, 10);
  
    return isNaN(parsedNumber) ? 0 : parsedNumber; // Return 0 if parsing fails
  };
  
  // Example usage:
  const result = parseCurrencyToNumber('₦7,000,000');
  console.log(result); // Output: 7000000
  