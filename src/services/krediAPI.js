import httpClient from './httpClient';

class KrediAPI {
  // Health check
  async healthCheck() {
    const response = await httpClient.get('/api/health');
    return response.data;
  }

  // System info
  async getSystemInfo() {
    const response = await httpClient.get('/');
    return response.data;
  }

  // Apply for loan
  async applyForLoan(applicationData) {
    const response = await httpClient.post('/api/apply', {
      walletAddress: applicationData.walletAddress,
      loanAmount: applicationData.loanAmount,
      purpose: applicationData.purpose,
      repayment_days: applicationData.repaymentDays
    });
    return response.data;
  }

  // Get loan status
  async getLoanStatus(walletAddress) {
    const response = await httpClient.get(`/api/status/${walletAddress}`);
    return response.data;
  }

  // Disburse loan (admin only)
  async disburseLoan(disburseData) {
    const response = await httpClient.post('/api/disburse', disburseData);
    return response.data;
  }

  // Get application by ID
  async getApplication(applicationId) {
    const response = await httpClient.get(`/api/applications/${applicationId}`);
    return response.data;
  }

  // Validate wallet address format
  static validateWalletAddress(address) {
    const stellarAddressRegex = /^G[A-Z0-9]{55}$/;
    return stellarAddressRegex.test(address);
  }

  // Validate loan amount
  static validateLoanAmount(amount, minAmount = 10, maxAmount = 1000) {
    const numAmount = parseFloat(amount);
    return numAmount >= minAmount && numAmount <= maxAmount;
  }

  // Validate purpose
  static validatePurpose(purpose) {
    return purpose && purpose.trim().length >= 10 && purpose.trim().length <= 500;
  }

  // Validate repayment days
  static validateRepaymentDays(days) {
    const numDays = parseInt(days);
    return numDays >= 1 && numDays <= 30;
  }

  // Get error message from API response
  static getErrorMessage(error) {
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
  }

  // Handle API error codes
  static handleErrorCode(errorCode) {
    const errorMessages = {
      VALIDATION_ERROR: 'Por favor verifica los datos ingresados',
      INVALID_WALLET: 'Dirección de wallet inválida',
      INVALID_AMOUNT: 'Monto inválido',
      INSUFFICIENT_CREDIT_SCORE: 'Puntaje de crédito insuficiente. Intenta con un monto menor.',
      CREDIT_LIMIT_EXCEEDED: 'Monto excede tu límite de crédito disponible',
      EXISTING_ACTIVE_LOAN: 'Ya tienes un préstamo activo. Paga el anterior para solicitar uno nuevo.',
      SOROBAN_ERROR: 'Error en la blockchain. Intenta más tarde.',
      DATABASE_ERROR: 'Error del sistema. Intenta más tarde.',
      NETWORK_ERROR: 'Error de conexión. Verifica tu internet.'
    };

    return errorMessages[errorCode] || 'Error desconocido';
  }
}

export default new KrediAPI();