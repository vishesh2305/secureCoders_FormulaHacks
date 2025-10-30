// Formatting utility functions for F1 DeFi Security Dashboard

/**
 * Shorten an Ethereum address
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} - Shortened address
 */
export const shortenAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;

  return `${address.substring(0, startChars)}...${address.substring(
    address.length - endChars
  )}`;
};

/**
 * Format ETH balance
 * @param {string|number} balance - Balance in ETH
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} - Formatted balance
 */
export const formatEthBalance = (balance, decimals = 4) => {
  if (!balance) return '0.0000';

  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toFixed(decimals);
};

/**
 * Format currency (USD)
 * @param {number} amount - Amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (!amount && amount !== 0) return '$0.00';

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }

  return `$${num.toFixed(decimals)}`;
};

/**
 * Format gas price in Gwei
 * @param {string|number} gasPrice - Gas price in Wei or Gwei
 * @param {boolean} isWei - Whether input is in Wei (default: false)
 * @returns {string} - Formatted gas price
 */
export const formatGasPrice = (gasPrice, isWei = false) => {
  if (!gasPrice) return '0';

  let num = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice;

  if (isWei) {
    num = num / 1e9; // Convert Wei to Gwei
  }

  return num.toFixed(0);
};

/**
 * Format timestamp to readable date/time
 * @param {number} timestamp - Unix timestamp
 * @param {boolean} includeTime - Include time in output (default: true)
 * @returns {string} - Formatted date/time
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);

  if (includeTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time for chart display (HH:mm:ss)
 * @param {Date|number} time - Date object or timestamp
 * @returns {string} - Formatted time
 */
export const formatChartTime = (time) => {
  const date = time instanceof Date ? time : new Date(time);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted number
 */
export const formatLargeNumber = (num, decimals = 1) => {
  if (!num && num !== 0) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(decimals)}K`;
  }

  return num.toString();
};

/**
 * Get time ago string (e.g., "2 minutes ago")
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Time ago string
 */
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';

  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};
