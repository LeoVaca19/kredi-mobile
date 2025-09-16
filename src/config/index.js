import { Platform } from 'react-native';
import Config from 'react-native-config';

export const API_CONFIG = {
  BASE_URL: Platform.OS === 'android' 
    ? Config.API_BASE_URL || 'http://10.0.2.2:3002'
    : Config.API_BASE_URL_IOS || 'http://localhost:3002',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

export const STELLAR_CONFIG = {
  NETWORK: Config.STELLAR_NETWORK || 'testnet',
  CONTRACT_ID: Config.SOROBAN_CONTRACT_ID,
  HORIZON_URL: Config.HORIZON_URL || 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL: Config.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
};

export const APP_CONFIG = {
  MIN_LOAN_AMOUNT: parseInt(Config.MIN_LOAN_AMOUNT) || 10,
  MAX_LOAN_AMOUNT: parseInt(Config.MAX_LOAN_AMOUNT) || 1000,
  DEFAULT_REPAYMENT_DAYS: parseInt(Config.DEFAULT_REPAYMENT_DAYS) || 7,
  SUPPORTED_CURRENCIES: ['USDC', 'XLM']
};