// Validation utilities
export const validateWalletAddress = (address) => {
  const stellarAddressRegex = /^G[A-Z0-9]{55}$/;
  return stellarAddressRegex.test(address);
};

export const validateLoanAmount = (amount, minAmount = 10, maxAmount = 1000) => {
  const numAmount = parseFloat(amount);
  return numAmount >= minAmount && numAmount <= maxAmount && !isNaN(numAmount);
};

export const validatePurpose = (purpose) => {
  return purpose && purpose.trim().length >= 10 && purpose.trim().length <= 500;
};

export const validateRepaymentDays = (days) => {
  const numDays = parseInt(days);
  return numDays >= 1 && numDays <= 30 && !isNaN(numDays);
};

// Formatting utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatShortDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: '2-digit',
    month: 'short',
    day: 'numeric'
  });
};

export const formatPublicKey = (publicKey, length = 4) => {
  if (!publicKey) return '';
  return `${publicKey.slice(0, length)}...${publicKey.slice(-length)}`;
};

// Status utilities
export const getStatusColor = (status) => {
  const colors = {
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444',
    disbursed: '#3B82F6',
    active: '#10B981',
    overdue: '#EF4444',
    paid: '#059669',
    default: '#6B7280'
  };
  
  return colors[status?.toLowerCase()] || colors.default;
};

export const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    disbursed: 'Desembolsado',
    active: 'Activo',
    overdue: 'Vencido',
    paid: 'Pagado'
  };
  
  return texts[status?.toLowerCase()] || status || 'Desconocido';
};

// Network utilities
export const isNetworkError = (error) => {
  return error.code === 'NETWORK_ERROR' || 
         error.message?.includes('Network Error') ||
         error.message?.includes('timeout');
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido';
};

// Utility functions for forms
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};