# 📡 Kredi Backend API - Guía de Consumo para Frontend# 📱 Kredi Mobile App - React Native Integration Guide

## 🎯 Guía de Endpoints y Consumo de API## 🚀 Guía Completa para Frontend en React Native

Esta guía te muestra exactamente cómo consumir las endpoints del backend de Kredi desde tu frontend React Native, incluyendo formatos de request/response, manejo de errores y validación de la conexión con contratos Soroban.Esta guía te muestra cómo integrar tu aplicación React Native con el backend de Kredi y los contratos inteligentes de Soroban en Stellar.

## 📋 Información del Backend## � Tabla de Contenidos

- **Base URL**: `http://localhost:3002` (desarrollo)1. [Setup & Configuración Inicial](#setup--configuración-inicial)

- **Formato**: JSON API con respuestas estandarizadas2. [Configuración del Entorno](#configuración-del-entorno)

- **Autenticación**: No requerida para endpoints públicos3. [Servicios API](#servicios-api)

- **Rate Limiting**: Implementado en el backend4. [Integración con Wallets Stellar](#integración-con-wallets-stellar)

5. [Componentes de UI](#componentes-de-ui)

---6. [Manejo de Estado](#manejo-de-estado)

7. [Navegación](#navegación)

## 1. Endpoints Disponibles8. [Casos de Uso Completos](#casos-de-uso-completos)

### 🏠 Sistema y Health Check---

#### GET `/` - Información del Sistema## 1. Setup & Configuración Inicial

```http

GET http://localhost:3002/### Crear el Proyecto

Content-Type: application/json

``````bash

# Crear nueva app React Native

**Response exitoso:**npx react-native@latest init KrediApp

```jsoncd KrediApp

{

  "success": true,# Para Expo (alternativa)

  "data": {npx create-expo-app KrediApp --template

    "name": "Kredi Analysis API",cd KrediApp

    "version": "1.0.0",```

    "description": "Backend service for micro-lending platform on Stellar network with dynamic credit scoring",

    "environment": "development",### Dependencias Principales

    "features": [

      "Dynamic Credit Scoring Engine",```bash

      "Risk-based Pricing",# Navegación

      "Automated Loan Management",npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

      "Grace Period & Liquidation Processing"npm install react-native-screens react-native-safe-area-context

    ],

    "endpoints": {# HTTP Client & Estado

      "health": "GET /api/health",npm install axios @reduxjs/toolkit react-redux

      "apply": "POST /api/apply",npm install react-native-async-storage/async-storage

      "disburse": "POST /api/disburse",

      "status": "GET /api/status/:walletAddress",# Stellar SDK

      "docs": "GET /api/docs"npm install @stellar/stellar-sdk

    },

    "cronJobs": {# UI & Styling

      "loanManagement": {npm install react-native-vector-icons

        "isRunning": true,npm install react-native-linear-gradient

        "nextRun": "2025-09-17T02:00:00Z",npm install react-native-modal

        "schedule": "Daily at 2 AM UTC"

      }# Wallets & Crypto

    }npm install react-native-keychain

  }npm install react-native-crypto

}npm install react-native-get-random-values

```

# Utils

**Uso en React Native:**npm install react-native-config

```javascriptnpm install react-native-toast-message

const getSystemInfo = async () => {npm install moment

  try {

    const response = await fetch('http://localhost:3002/');# Desarrollo

    const data = await response.json();npm install --save-dev @types/react-native

    ```

    if (data.success) {

      console.log('Backend version:', data.data.version);### Configuración iOS/Android

      console.log('Available endpoints:', data.data.endpoints);

      return data.data;```bash

    }# iOS (después de instalar pods)

  } catch (error) {cd ios && pod install && cd ..

    console.error('Backend not available:', error);

    throw new Error('No se puede conectar al backend');# Android - Asegúrate de que android/settings.gradle incluye:

  }# include ':react-native-vector-icons'

};# project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')

``````

#### GET `/api/health` - Health Check Simple---

```http

GET http://localhost:3002/api/health## 2. Configuración del Entorno

```

### Variables de Entorno (.env)

**Response:**

```json```bash

{# .env

  "success": true,API_BASE_URL=<http://10.0.2.2:3002>

  "status": "healthy",API_BASE_URL_IOS=<http://localhost:3002>

  "timestamp": "2025-09-16T15:30:00Z"STELLAR_NETWORK=testnet

}SOROBAN_CONTRACT_ID=CAGTJ7PP65CO7I3OEDLEBUNFQXTQH5XTN2IGOPNZNAI5DGBYHXCLO4KJ

```HORIZON_URL=https://horizon-testnet.stellar.org

SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

**Uso para verificar conectividad:**```

```javascript

const checkBackendHealth = async () => {### Config Helper

  try {

    const response = await fetch('http://localhost:3002/api/health');```javascript

    const data = await response.json();// src/config/index.js

    return data.success && data.status === 'healthy';import Config from 'react-native-config';

  } catch (error) {import { Platform } from 'react-native';

    return false;

  }export const API_CONFIG = {

};  BASE_URL: Platform.OS === 'android' 

```    ? Config.API_BASE_URL || 'http://10.0.2.2:3002'

    : Config.API_BASE_URL_IOS || 'http://localhost:3002',

---  TIMEOUT: 10000,

  RETRY_ATTEMPTS: 3

## 2. Aplicación de Préstamos};



#### POST `/api/apply` - Solicitar Préstamoexport const STELLAR_CONFIG = {

  NETWORK: Config.STELLAR_NETWORK || 'testnet',

**Request Format:**  CONTRACT_ID: Config.SOROBAN_CONTRACT_ID,

```http  HORIZON_URL: Config.HORIZON_URL || 'https://horizon-testnet.stellar.org',

POST http://localhost:3002/api/apply  SOROBAN_RPC_URL: Config.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'

Content-Type: application/json};



{export const APP_CONFIG = {

  "walletAddress": "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7",  MIN_LOAN_AMOUNT: 10,

  "loanAmount": 150,  MAX_LOAN_AMOUNT: 1000,

  "purpose": "Purchase inventory for retail business - need working capital for seasonal products",  DEFAULT_REPAYMENT_DAYS: 7,

  "repayment_days": 7  SUPPORTED_CURRENCIES: ['USDC', 'XLM']

}};

``````

**Validaciones de Request:**---

- `walletAddress`: String, pattern `^G[A-Z0-9]{55}$` (56 caracteres, inicia con G)

- `loanAmount`: Number, mínimo 10, máximo 1000## 3. Servicios API

- `purpose`: String, mínimo 10 caracteres, máximo 500

- `repayment_days`: Integer, mínimo 1, máximo 30### HTTP Client Base

**Response Exitoso (APPROVED):**```javascript

```json// src/services/httpClient.js

{import axios from 'axios';

  "success": true,import AsyncStorage from '@react-native-async-storage/async-storage';

  "data": {import { API_CONFIG } from '../config';

    "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",import { showErrorToast, showSuccessToast } from '../utils/toast';

    "status": "APPROVED",

    "message": "Congratulations! Your loan has been approved. Please deposit 20% collateral to proceed with disbursement.",class HttpClient {

    "loanDetails": {  constructor() {

      "amount": 150,    this.client = axios.create({

      "repaymentDays": 7,      baseURL: API_CONFIG.BASE_URL,

      "commission": 18.75,      timeout: API_CONFIG.TIMEOUT,

      "commissionRate": 12.5,      headers: {

      "totalRepayment": 168.75,        'Content-Type': 'application/json'

      "dueDate": "2025-09-23T15:30:00Z",      }

      "collateralRequired": 30,    });

      "creditScore": 75,

      "creditLimit": 500    this.setupInterceptors();

    },  }

    "nextSteps": [

      "Deposit 20% collateral (30 USDC)",  setupInterceptors() {

      "Wait for disbursement confirmation",    // Request interceptor

      "Funds will be available within 1 hour"    this.client.interceptors.request.use(

    ]      async (config) => {

  }        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

}        

```        // Add auth token if available

        const token = await AsyncStorage.getItem('auth_token');

**Response Rechazado (REJECTED):**        if (token) {

```json          config.headers.Authorization = `Bearer ${token}`;

{        }

  "success": true,        

  "data": {        return config;

    "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",      },

    "status": "REJECTED",      (error) => {

    "message": "Loan application rejected due to insufficient credit score.",        console.error('❌ Request Error:', error);

    "rejectionReason": "Credit score below minimum threshold",        return Promise.reject(error);

    "creditScore": 45,      }

    "minimumRequired": 70,    );

    "suggestions": [

      "Build transaction history on Stellar network",    // Response interceptor

      "Apply for a smaller loan amount",    this.client.interceptors.response.use(

      "Try again in 30 days"      (response) => {

    ]        console.log(`✅ API Response: ${response.status} ${response.config.url}`);

  }        return response;

}      },

```      async (error) => {

        console.error('❌ Response Error:', error.response?.data || error.message);

**Errores Comunes:**        

```json        // Handle specific error cases

{        if (error.response?.status === 401) {

  "success": false,          // Clear auth data

  "error": "Validation failed",          await AsyncStorage.removeItem('auth_token');

  "code": "VALIDATION_ERROR",          showErrorToast('Sesión expirada. Por favor, vuelve a conectar tu wallet.');

  "details": {        } else if (error.response?.status >= 500) {

    "walletAddress": "Invalid Stellar wallet address format",          showErrorToast('Error del servidor. Inténtalo más tarde.');

    "loanAmount": "Amount must be between 10 and 1000"        } else if (error.code === 'NETWORK_ERROR') {

  }          showErrorToast('Error de conexión. Verifica tu internet.');

}        }

```

        return Promise.reject(error);

**Implementación en React Native:**      }

```javascript    );

const applyForLoan = async (applicationData) => {  }

  try {

    const response = await fetch('http://localhost:3002/api/apply', {  // Retry mechanism

      method: 'POST',  async requestWithRetry(config, retries = API_CONFIG.RETRY_ATTEMPTS) {

      headers: {    try {

        'Content-Type': 'application/json',      return await this.client.request(config);

      },    } catch (error) {

      body: JSON.stringify({      if (retries > 0 && this.shouldRetry(error)) {

        walletAddress: applicationData.walletAddress,        console.log(`🔄 Retrying request. Attempts left: ${retries - 1}`);

        loanAmount: applicationData.loanAmount,        await this.delay(1000);

        purpose: applicationData.purpose,        return this.requestWithRetry(config, retries - 1);

        repayment_days: applicationData.repaymentDays      }

      })      throw error;

    });    }

  }

    const data = await response.json();

  shouldRetry(error) {

    if (!response.ok) {    return (

      // Manejar errores HTTP      error.code === 'NETWORK_ERROR' ||

      throw new Error(data.error || `HTTP ${response.status}`);      error.code === 'TIMEOUT' ||

    }      (error.response && error.response.status >= 500)

    );

    if (data.success) {  }

      // Solicitud procesada exitosamente

      if (data.data.status === 'APPROVED') {  delay(ms) {

        console.log('✅ Loan approved:', data.data.applicationId);    return new Promise(resolve => setTimeout(resolve, ms));

        console.log('💰 Amount:', data.data.loanDetails.amount);  }

        console.log('💳 Commission:', data.data.loanDetails.commission);

        return { success: true, ...data.data };  // HTTP methods

      } else if (data.data.status === 'REJECTED') {  get(url, config = {}) {

        console.log('❌ Loan rejected:', data.data.rejectionReason);    return this.requestWithRetry({ ...config, method: 'GET', url });

        return { success: false, rejected: true, ...data.data };  }

      }

    } else {  post(url, data, config = {}) {

      throw new Error(data.error || 'Unknown error');    return this.requestWithRetry({ ...config, method: 'POST', url, data });

    }  }

  } catch (error) {

    console.error('Apply loan error:', error);  put(url, data, config = {}) {

    throw error;    return this.requestWithRetry({ ...config, method: 'PUT', url, data });

  }  }

};

  delete(url, config = {}) {

// Uso en componente    return this.requestWithRetry({ ...config, method: 'DELETE', url, config });

const handleApply = async () => {  }

  try {}

    setLoading(true);

    const result = await applyForLoan({export default new HttpClient();

      walletAddress: wallet.publicKey,```

      loanAmount: parseFloat(amount),

      purpose: purpose.trim(),### API Service Layer

      repaymentDays: parseInt(days)

    });```javascript

// src/services/krediAPI.js

    if (result.success) {import httpClient from './httpClient';

      Alert.alert(

        'Préstamo Aprobado',export class KrediAPI {

        `Monto: $${result.loanDetails.amount}\nComisión: $${result.loanDetails.commission}\nTotal a pagar: $${result.loanDetails.totalRepayment}`,  // Health check

        [{ text: 'OK', onPress: () => navigation.navigate('LoanStatus') }]  async healthCheck() {

      );    const response = await httpClient.get('/api/health');

    } else if (result.rejected) {    return response.data;

      Alert.alert(  }

        'Préstamo Rechazado',

        `Razón: ${result.rejectionReason}\nPuntaje de crédito: ${result.creditScore}/100`,  // System info

        [{ text: 'OK' }]  async getSystemInfo() {

      );    const response = await httpClient.get('/');

    }    return response.data;

  } catch (error) {  }

    Alert.alert('Error', error.message);

  } finally {  // Apply for loan

    setLoading(false);  async applyForLoan(applicationData) {

  }    const response = await httpClient.post('/api/apply', {

};      walletAddress: applicationData.walletAddress,

```      loanAmount: applicationData.loanAmount,

      purpose: applicationData.purpose,

---      repayment_days: applicationData.repaymentDays

    });

## 3. Consulta de Estado    return response.data;

  }

#### GET `/api/status/:walletAddress` - Estado de Préstamos

  // Get loan status

**Request:**  async getLoanStatus(walletAddress) {

```http    const response = await httpClient.get(`/api/status/${walletAddress}`);

GET http://localhost:3002/api/status/GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7    return response.data;

```  }



**Response con préstamos:**  // Disburse loan (admin only)

```json  async disburseLoan(disburseData) {

{    const response = await httpClient.post('/api/disburse', disburseData);

  "success": true,    return response.data;

  "data": {  }

    "walletAddress": "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7",

    "creditScore": 75,  // Get application by ID

    "creditLimit": 500,  async getApplication(applicationId) {

    "currentDebt": 150,    const response = await httpClient.get(`/api/applications/${applicationId}`);

    "availableCredit": 350,    return response.data;

    "loans": [  }

      {}

        "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",

        "status": "ACTIVE",export default new KrediAPI();

        "amount": 150,```

        "commission": 18.75,

        "totalRepayment": 168.75,---

        "amountPaid": 0,

        "remainingBalance": 168.75,## 4. Integración con Wallets Stellar

        "applicationDate": "2025-09-16T15:30:00Z",

        "dueDate": "2025-09-23T15:30:00Z",### Wallet Service

        "purpose": "Purchase inventory for retail business",

        "repaymentDays": 7,```javascript

        "daysUntilDue": 7,// src/services/walletService.js

        "isOverdue": falseimport { Keypair, Networks, StellarSdk } from '@stellar/stellar-sdk';

      }import AsyncStorage from '@react-native-async-storage/async-storage';

    ],import Keychain from 'react-native-keychain';

    "summary": {import { STELLAR_CONFIG } from '../config';

      "totalLoans": 1,

      "activeLoans": 1,class WalletService {

      "completedLoans": 0,  constructor() {

      "totalBorrowed": 150,    this.server = new StellarSdk.Server(STELLAR_CONFIG.HORIZON_URL);

      "totalRepaid": 0,    this.networkPassphrase = STELLAR_CONFIG.NETWORK === 'testnet' 

      "onTimePayments": 0,      ? Networks.TESTNET 

      "latePayments": 0      : Networks.PUBLIC;

    }  }

  }

}  // Generate new wallet

```  async generateWallet() {

    try {

**Response sin préstamos:**      const keypair = Keypair.random();

```json      const walletData = {

{        publicKey: keypair.publicKey(),

  "success": true,        secretKey: keypair.secret(),

  "data": {        createdAt: new Date().toISOString()

    "walletAddress": "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7",      };

    "creditScore": 50,

    "creditLimit": 100,      return walletData;

    "currentDebt": 0,    } catch (error) {

    "availableCredit": 100,      throw new Error(`Error generando wallet: ${error.message}`);

    "loans": [],    }

    "summary": {  }

      "totalLoans": 0,

      "activeLoans": 0,  // Save wallet securely

      "completedLoans": 0,  async saveWallet(walletData, pin) {

      "totalBorrowed": 0,    try {

      "totalRepaid": 0,      // Save secret key in Keychain (más seguro)

      "onTimePayments": 0,      await Keychain.setInternetCredentials(

      "latePayments": 0        'kredi_wallet',

    }        walletData.publicKey,

  }        walletData.secretKey

}      );

```

      // Save public data in AsyncStorage

**Error - Wallet no válida:**      const publicWalletData = {

```json        publicKey: walletData.publicKey,

{        createdAt: walletData.createdAt,

  "success": false,        isSecured: true

  "error": "Invalid wallet address format",      };

  "code": "INVALID_WALLET"

}      await AsyncStorage.setItem('wallet_data', JSON.stringify(publicWalletData));

```      await AsyncStorage.setItem('current_wallet', walletData.publicKey);



**Implementación en React Native:**      return publicWalletData;

```javascript    } catch (error) {

const getLoanStatus = async (walletAddress) => {      throw new Error(`Error guardando wallet: ${error.message}`);

  try {    }

    const response = await fetch(`http://localhost:3002/api/status/${walletAddress}`);  }

    const data = await response.json();

  // Load wallet

    if (!response.ok) {  async loadWallet() {

      throw new Error(data.error || `HTTP ${response.status}`);    try {

    }      const currentWallet = await AsyncStorage.getItem('current_wallet');

      if (!currentWallet) return null;

    if (data.success) {

      return data.data;      const walletData = await AsyncStorage.getItem('wallet_data');

    } else {      if (!walletData) return null;

      throw new Error(data.error || 'Error getting loan status');

    }      return JSON.parse(walletData);

  } catch (error) {    } catch (error) {

    console.error('Get loan status error:', error);      console.error('Error cargando wallet:', error);

    throw error;      return null;

  }    }

};  }



// Uso en componente de dashboard  // Get secret key (requires authentication)

const [loanData, setLoanData] = useState(null);  async getSecretKey(publicKey) {

const [loading, setLoading] = useState(true);    try {

      const credentials = await Keychain.getInternetCredentials('kredi_wallet');

const loadLoanStatus = async () => {      if (credentials && credentials.username === publicKey) {

  try {        return credentials.password;

    setLoading(true);      }

    const data = await getLoanStatus(wallet.publicKey);      throw new Error('Secret key no encontrada');

    setLoanData(data);    } catch (error) {

          throw new Error(`Error obteniendo secret key: ${error.message}`);

    console.log(`💳 Credit Score: ${data.creditScore}/100`);    }

    console.log(`💰 Credit Limit: $${data.creditLimit}`);  }

    console.log(`📊 Active Loans: ${data.summary.activeLoans}`);

      // Import existing wallet

  } catch (error) {  async importWallet(secretKey) {

    Alert.alert('Error', error.message);    try {

  } finally {      const keypair = Keypair.fromSecret(secretKey);

    setLoading(false);      const walletData = {

  }        publicKey: keypair.publicKey(),

};        secretKey: secretKey,

        createdAt: new Date().toISOString()

useEffect(() => {      };

  if (wallet?.publicKey) {

    loadLoanStatus();      return walletData;

  }    } catch (error) {

}, [wallet?.publicKey]);      throw new Error(`Secret key inválida: ${error.message}`);

```    }

  }

---

  // Get account info

## 4. Desembolso (Admin)  async getAccountInfo(publicKey) {

    try {

#### POST `/api/disburse` - Desembolsar Préstamo      const account = await this.server.loadAccount(publicKey);

      return {

**Request:**        accountId: account.accountId(),

```http        sequenceNumber: account.sequenceNumber(),

POST http://localhost:3002/api/disburse        balances: account.balances,

Content-Type: application/json        signers: account.signers,

        thresholds: account.thresholds

{      };

  "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",    } catch (error) {

  "adminKey": "your-admin-secret-key"      if (error.response && error.response.status === 404) {

}        return null; // Account doesn't exist

```      }

      throw error;

**Response exitoso:**    }

```json  }

{

  "success": true,  // Get balance for specific asset

  "data": {  getAssetBalance(balances, assetCode = 'native') {

    "transactionId": "tx_abc123def456",    if (assetCode === 'native' || assetCode === 'XLM') {

    "status": "DISBURSED",      const nativeBalance = balances.find(b => b.asset_type === 'native');

    "amount": 150,      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;

    "disbursedAt": "2025-09-16T16:00:00Z",    }

    "blockchainTxHash": "a1b2c3d4e5f6...",

    "message": "Loan disbursed successfully"    const assetBalance = balances.find(b => 

  }      b.asset_type !== 'native' && 

}      b.asset_code === assetCode

```    );

    return assetBalance ? parseFloat(assetBalance.balance) : 0;

---  }



## 5. Manejo de Errores Estándar  // Fund testnet account

  async fundTestnetAccount(publicKey) {

### Códigos de Error Comunes    try {

      const response = await fetch(

```javascript        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`

const ERROR_CODES = {      );

  // Validación      

  VALIDATION_ERROR: 'VALIDATION_ERROR',      if (!response.ok) {

  INVALID_WALLET: 'INVALID_WALLET',        throw new Error('Error funding account');

  INVALID_AMOUNT: 'INVALID_AMOUNT',      }

        

  // Crédito      return await response.json();

  INSUFFICIENT_CREDIT_SCORE: 'INSUFFICIENT_CREDIT_SCORE',    } catch (error) {

  CREDIT_LIMIT_EXCEEDED: 'CREDIT_LIMIT_EXCEEDED',      throw new Error(`Error funding testnet account: ${error.message}`);

  EXISTING_ACTIVE_LOAN: 'EXISTING_ACTIVE_LOAN',    }

    }

  // Sistema

  SOROBAN_ERROR: 'SOROBAN_ERROR',  // Clear wallet data

  DATABASE_ERROR: 'DATABASE_ERROR',  async clearWallet() {

  NETWORK_ERROR: 'NETWORK_ERROR'    try {

};      await Keychain.resetInternetCredentials('kredi_wallet');

      await AsyncStorage.removeItem('wallet_data');

const handleAPIError = (error, response) => {      await AsyncStorage.removeItem('current_wallet');

  const errorData = response?.data || error;    } catch (error) {

        console.error('Error clearing wallet:', error);

  switch (errorData.code) {    }

    case ERROR_CODES.VALIDATION_ERROR:  }

      return 'Por favor verifica los datos ingresados';}

    

    case ERROR_CODES.INSUFFICIENT_CREDIT_SCORE:export default new WalletService();

      return 'Puntaje de crédito insuficiente. Intenta con un monto menor.';```

    

    case ERROR_CODES.CREDIT_LIMIT_EXCEEDED:### Wallet Hook

      return 'Monto excede tu límite de crédito disponible';

    ```javascript

    case ERROR_CODES.EXISTING_ACTIVE_LOAN:// src/hooks/useWallet.js

      return 'Ya tienes un préstamo activo. Paga el anterior para solicitar uno nuevo.';import { useState, useEffect, useCallback } from 'react';

    import { useDispatch, useSelector } from 'react-redux';

    case ERROR_CODES.SOROBAN_ERROR:import walletService from '../services/walletService';

      return 'Error en la blockchain. Intenta más tarde.';import { setWallet, clearWallet, setLoading, setError } from '../store/slices/walletSlice';

    import { showSuccessToast, showErrorToast } from '../utils/toast';

    case ERROR_CODES.DATABASE_ERROR:

      return 'Error del sistema. Intenta más tarde.';export const useWallet = () => {

      const dispatch = useDispatch();

    default:  const { wallet, loading, error, isConnected } = useSelector(state => state.wallet);

      return errorData.error || 'Error desconocido';  const [accountInfo, setAccountInfo] = useState(null);

  }  const [refreshing, setRefreshing] = useState(false);

};

```  // Load wallet on mount

  useEffect(() => {

---    loadWallet();

  }, []);

## 6. Testing de Endpoints

  // Load account info when wallet changes

### Script de Testing Completo  useEffect(() => {

    if (wallet?.publicKey) {

```javascript      loadAccountInfo();

// testEndpoints.js - Para verificar que el backend funciona    }

const BASE_URL = 'http://localhost:3002';  }, [wallet?.publicKey]);



const testEndpoints = async () => {  const loadWallet = async () => {

  console.log('🧪 Testing Kredi Backend Endpoints...\n');    try {

      dispatch(setLoading(true));

  // 1. Test health check      const walletData = await walletService.loadWallet();

  try {      if (walletData) {

    const health = await fetch(`${BASE_URL}/api/health`);        dispatch(setWallet(walletData));

    const healthData = await health.json();      }

    console.log('✅ Health Check:', healthData.status);    } catch (error) {

  } catch (error) {      dispatch(setError(error.message));

    console.log('❌ Health Check failed:', error.message);    } finally {

    return;      dispatch(setLoading(false));

  }    }

  };

  // 2. Test system info

  try {  const loadAccountInfo = useCallback(async () => {

    const system = await fetch(`${BASE_URL}/`);    if (!wallet?.publicKey) return;

    const systemData = await system.json();

    console.log('✅ System Info:', systemData.data.name);    try {

    console.log('📊 Features:', systemData.data.features.length);      const info = await walletService.getAccountInfo(wallet.publicKey);

  } catch (error) {      setAccountInfo(info);

    console.log('❌ System Info failed:', error.message);    } catch (error) {

  }      console.error('Error loading account info:', error);

      setAccountInfo(null);

  // 3. Test loan application (with test wallet)    }

  const testWallet = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7';  }, [wallet?.publicKey]);

  

  try {  const createWallet = async () => {

    const applicationResponse = await fetch(`${BASE_URL}/api/apply`, {    try {

      method: 'POST',      dispatch(setLoading(true));

      headers: { 'Content-Type': 'application/json' },      dispatch(setError(null));

      body: JSON.stringify({

        walletAddress: testWallet,      const newWallet = await walletService.generateWallet();

        loanAmount: 100,      const savedWallet = await walletService.saveWallet(newWallet);

        purpose: 'Testing loan application from frontend integration test',      

        repayment_days: 7      dispatch(setWallet(savedWallet));

      })      

    });      // Fund testnet account if on testnet

          if (STELLAR_CONFIG.NETWORK === 'testnet') {

    const applicationData = await applicationResponse.json();        try {

              await walletService.fundTestnetAccount(savedWallet.publicKey);

    if (applicationData.success) {          showSuccessToast('Wallet creado y financiado en testnet');

      console.log('✅ Loan Application:', applicationData.data.status);        } catch (fundError) {

      console.log('💰 Application ID:', applicationData.data.applicationId);          showErrorToast('Wallet creado pero no se pudo financiar en testnet');

              }

      if (applicationData.data.status === 'APPROVED') {      } else {

        console.log('💳 Credit Score:', applicationData.data.loanDetails.creditScore);        showSuccessToast('Wallet creado exitosamente');

        console.log('💸 Commission:', applicationData.data.loanDetails.commission);      }

      }

    } else {      return savedWallet;

      console.log('❌ Loan Application failed:', applicationData.error);    } catch (error) {

    }      const errorMessage = error.message || 'Error creando wallet';

  } catch (error) {      dispatch(setError(errorMessage));

    console.log('❌ Loan Application error:', error.message);      showErrorToast(errorMessage);

  }      throw error;

    } finally {

  // 4. Test loan status      dispatch(setLoading(false));

  try {    }

    const statusResponse = await fetch(`${BASE_URL}/api/status/${testWallet}`);  };

    const statusData = await statusResponse.json();

      const importWallet = async (secretKey) => {

    if (statusData.success) {    try {

      console.log('✅ Loan Status retrieved');      dispatch(setLoading(true));

      console.log('📊 Credit Score:', statusData.data.creditScore);      dispatch(setError(null));

      console.log('💳 Credit Limit:', statusData.data.creditLimit);

      console.log('📈 Active Loans:', statusData.data.summary.activeLoans);      const importedWallet = await walletService.importWallet(secretKey);

    } else {      const savedWallet = await walletService.saveWallet(importedWallet);

      console.log('❌ Loan Status failed:', statusData.error);      

    }      dispatch(setWallet(savedWallet));

  } catch (error) {      showSuccessToast('Wallet importado exitosamente');

    console.log('❌ Loan Status error:', error.message);

  }      return savedWallet;

    } catch (error) {

  console.log('\n🏁 Testing completed!');      const errorMessage = error.message || 'Error importando wallet';

};      dispatch(setError(errorMessage));

      showErrorToast(errorMessage);

// Ejecutar tests      throw error;

testEndpoints();    } finally {

```      dispatch(setLoading(false));

    }

---  };



## 7. Configuración de Red para React Native  const disconnectWallet = async () => {

    try {

### Para Android (localhost mapping)      await walletService.clearWallet();

      dispatch(clearWallet());

```javascript      setAccountInfo(null);

// config/api.js      showSuccessToast('Wallet desconectado');

import { Platform } from 'react-native';    } catch (error) {

      showErrorToast('Error desconectando wallet');

const getBaseURL = () => {    }

  if (__DEV__) {  };

    // En desarrollo

    return Platform.OS === 'android'   const refreshAccount = async () => {

      ? 'http://10.0.2.2:3002'  // Android emulator    setRefreshing(true);

      : 'http://localhost:3002'; // iOS simulator    await loadAccountInfo();

  } else {    setRefreshing(false);

    // En producción  };

    return 'https://api.kredi.finance';

  }  const getBalance = useCallback((assetCode = 'XLM') => {

};    if (!accountInfo?.balances) return 0;

    return walletService.getAssetBalance(accountInfo.balances, assetCode);

export const API_CONFIG = {  }, [accountInfo]);

  BASE_URL: getBaseURL(),

  TIMEOUT: 10000  return {

};    // State

```    wallet,

    loading,

### Verificación de Conectividad    error,

    isConnected,

```javascript    accountInfo,

const verifyBackendConnection = async () => {    refreshing,

  try {    

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`, {    // Actions

      method: 'GET',    createWallet,

      timeout: 5000    importWallet,

    });    disconnectWallet,

        refreshAccount,

    if (response.ok) {    loadAccountInfo,

      console.log('✅ Backend connection verified');    

      return true;    // Utils

    } else {    getBalance,

      console.log('❌ Backend responded with error:', response.status);    

      return false;    // Computed

    }    xlmBalance: getBalance('XLM'),

  } catch (error) {    usdcBalance: getBalance('USDC'),

    console.log('❌ Cannot connect to backend:', error.message);    accountExists: !!accountInfo,

    return false;    publicKey: wallet?.publicKey,

  }    shortPublicKey: wallet?.publicKey ? 

};      `${wallet.publicKey.slice(0, 4)}...${wallet.publicKey.slice(-4)}` : null

  };

// Verificar al iniciar la app};

useEffect(() => {```

  verifyBackendConnection();

}, []);---

```

## 5. Componentes de UI

---

### Wallet Connection Component

## 8. Integración con Contratos Soroban

```javascript

### Verificación de Estado del Contrato// src/components/WalletConnector.js

import React, { useState } from 'react';

```javascriptimport {

// Verificar que el backend pueda comunicarse con Soroban  View,

const checkContractIntegration = async () => {  Text,

  try {  TouchableOpacity,

    // El endpoint de system info incluye información del contrato  StyleSheet,

    const systemInfo = await getSystemInfo();  Alert,

      Modal,

    console.log('🔗 Contract ID:', systemInfo.contractInfo?.contractId);  TextInput,

    console.log('🌐 Network:', systemInfo.contractInfo?.network);  ActivityIndicator

    console.log('📡 RPC URL:', systemInfo.contractInfo?.rpcUrl);} from 'react-native';

    import { useWallet } from '../hooks/useWallet';

    // Si el backend devuelve esta información, significa que la conexión funcionaimport Icon from 'react-native-vector-icons/MaterialIcons';

    return systemInfo.contractInfo !== null;

  } catch (error) {const WalletConnector = () => {

    console.error('❌ Contract integration check failed:', error);  const { 

    return false;    wallet, 

  }    loading, 

};    error, 

```    isConnected, 

    createWallet, 

### Monitoreo de Transacciones    importWallet, 

    disconnectWallet,

```javascript    shortPublicKey 

// Después de una aplicación exitosa, puedes monitorear el estado  } = useWallet();

const monitorLoanStatus = async (applicationId, walletAddress) => {  

  const checkStatus = async () => {  const [showOptions, setShowOptions] = useState(false);

    try {  const [showImportModal, setShowImportModal] = useState(false);

      const status = await getLoanStatus(walletAddress);  const [importSecret, setImportSecret] = useState('');

      const loan = status.loans.find(l => l.applicationId === applicationId);  const [importLoading, setImportLoading] = useState(false);

      

      if (loan) {  const handleCreateWallet = async () => {

        console.log(`📊 Loan ${applicationId} status: ${loan.status}`);    try {

              Alert.alert(

        // Si el estado cambió a DISBURSED, la transacción en Soroban se completó        'Crear Nueva Wallet',

        if (loan.status === 'DISBURSED') {        'Se generará una nueva wallet Stellar. ¿Continuar?',

          console.log('✅ Loan disbursed successfully');        [

          return loan;          { text: 'Cancelar', style: 'cancel' },

        }          {

      }            text: 'Crear',

                  onPress: async () => {

      return null;              await createWallet();

    } catch (error) {              setShowOptions(false);

      console.error('Error checking loan status:', error);            }

      return null;          }

    }        ]

  };      );

    } catch (error) {

  // Verificar cada 30 segundos hasta que se complete      console.error('Error creating wallet:', error);

  const interval = setInterval(async () => {    }

    const loan = await checkStatus();  };

    if (loan && loan.status === 'DISBURSED') {

      clearInterval(interval);  const handleImportWallet = async () => {

      // Notificar al usuario que el préstamo fue desembolsado    if (!importSecret.trim()) {

    }      Alert.alert('Error', 'Por favor ingresa tu secret key');

  }, 30000);      return;

    }

  // Timeout después de 10 minutos

  setTimeout(() => {    try {

    clearInterval(interval);      setImportLoading(true);

    console.log('⏰ Loan monitoring timeout');      await importWallet(importSecret.trim());

  }, 600000);      setShowImportModal(false);

};      setShowOptions(false);

```      setImportSecret('');

    } catch (error) {

---      Alert.alert('Error', 'Secret key inválida');

    } finally {

## 🔧 Troubleshooting      setImportLoading(false);

    }

### Errores Comunes y Soluciones  };



1. **"Network request failed"**  const handleDisconnect = () => {

   - Verificar que el backend esté corriendo en puerto 3002    Alert.alert(

   - En Android: usar `10.0.2.2:3002` en lugar de `localhost:3002`      'Desconectar Wallet',

   - Verificar que no haya firewall bloqueando la conexión      '¿Estás seguro de que quieres desconectar tu wallet?',

      [

2. **"VALIDATION_ERROR" en requests**        { text: 'Cancelar', style: 'cancel' },

   - Verificar formato de wallet address (debe empezar con 'G' y tener 56 caracteres)        { text: 'Desconectar', onPress: disconnectWallet, style: 'destructive' }

   - Validar que los montos estén entre 10 y 1000      ]

   - Asegurar que el propósito tenga al menos 10 caracteres    );

  };

3. **"SOROBAN_ERROR"**

   - Verificar que el contrato Soroban esté desplegado  if (isConnected && wallet) {

   - Confirmar que el RPC URL sea accesible    return (

   - Revisar logs del backend para detalles específicos      <View style={styles.connectedContainer}>

        <View style={styles.walletInfo}>

4. **Respuestas vacías o timeout**          <Icon name="account-balance-wallet" size={24} color="#10B981" />

   - Aumentar timeout en las requests          <View style={styles.walletDetails}>

   - Verificar que la base de datos esté conectada            <Text style={styles.connectedText}>Wallet Conectada</Text>

   - Revisar logs del backend para errores internos            <Text style={styles.addressText}>{shortPublicKey}</Text>

          </View>

### Verificación Final        </View>

        <TouchableOpacity 

```bash          style={styles.disconnectButton} 

# Verificar que el backend esté corriendo          onPress={handleDisconnect}

curl http://localhost:3002/api/health        >

          <Text style={styles.disconnectText}>Desconectar</Text>

# Testing rápido de endpoint principal        </TouchableOpacity>

curl -X POST http://localhost:3002/api/apply \      </View>

  -H "Content-Type: application/json" \    );

  -d '{  }

    "walletAddress": "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7",

    "loanAmount": 100,  return (

    "purpose": "Test loan application",    <>

    "repayment_days": 7      <TouchableOpacity

  }'        style={styles.connectButton}

```        onPress={() => setShowOptions(true)}

        disabled={loading}

---      >

        {loading ? (

## 📱 Implementación Rápida en React Native          <ActivityIndicator color="#FFFFFF" />

        ) : (

### Cliente HTTP Simple          <>

            <Icon name="account-balance-wallet" size={20} color="#FFFFFF" />

```javascript            <Text style={styles.connectButtonText}>Conectar Wallet</Text>

// api/krediClient.js          </>

import { Platform } from 'react-native';        )}

      </TouchableOpacity>

const BASE_URL = Platform.OS === 'android' 

  ? 'http://10.0.2.2:3002'       {/* Options Modal */}

  : 'http://localhost:3002';      <Modal

        visible={showOptions}

class KrediClient {        transparent

  async request(endpoint, options = {}) {        animationType="slide"

    try {        onRequestClose={() => setShowOptions(false)}

      const url = `${BASE_URL}${endpoint}`;      >

      const response = await fetch(url, {        <View style={styles.modalOverlay}>

        timeout: 10000,          <View style={styles.modalContent}>

        ...options,            <Text style={styles.modalTitle}>Conectar Wallet</Text>

        headers: {            

          'Content-Type': 'application/json',            <TouchableOpacity 

          ...options.headers              style={styles.optionButton}

        }              onPress={handleCreateWallet}

      });            >

              <Icon name="add-circle" size={24} color="#3B82F6" />

      const data = await response.json();              <View style={styles.optionTextContainer}>

                <Text style={styles.optionTitle}>Crear Nueva Wallet</Text>

      if (!response.ok) {                <Text style={styles.optionDescription}>

        throw new Error(data.error || `HTTP ${response.status}`);                  Genera una nueva wallet Stellar

      }                </Text>

              </View>

      return data;            </TouchableOpacity>

    } catch (error) {

      console.error('API request failed:', error);            <TouchableOpacity 

      throw error;              style={styles.optionButton}

    }              onPress={() => {

  }                setShowOptions(false);

                setShowImportModal(true);

  // Health check              }}

  async healthCheck() {            >

    return this.request('/api/health');              <Icon name="file-download" size={24} color="#3B82F6" />

  }              <View style={styles.optionTextContainer}>

                <Text style={styles.optionTitle}>Importar Wallet</Text>

  // System info                <Text style={styles.optionDescription}>

  async getSystemInfo() {                  Usa tu secret key existente

    return this.request('/');                </Text>

  }              </View>

            </TouchableOpacity>

  // Apply for loan

  async applyForLoan(applicationData) {            <TouchableOpacity 

    return this.request('/api/apply', {              style={styles.cancelButton}

      method: 'POST',              onPress={() => setShowOptions(false)}

      body: JSON.stringify(applicationData)            >

    });              <Text style={styles.cancelButtonText}>Cancelar</Text>

  }            </TouchableOpacity>

          </View>

  // Get loan status        </View>

  async getLoanStatus(walletAddress) {      </Modal>

    return this.request(`/api/status/${walletAddress}`);

  }      {/* Import Modal */}

}      <Modal

        visible={showImportModal}

export default new KrediClient();        transparent

```        animationType="slide"

        onRequestClose={() => setShowImportModal(false)}

### Hook para Préstamos      >

        <View style={styles.modalOverlay}>

```javascript          <View style={styles.modalContent}>

// hooks/useLoans.js            <Text style={styles.modalTitle}>Importar Wallet</Text>

import { useState, useEffect } from 'react';            

import KrediClient from '../api/krediClient';            <Text style={styles.inputLabel}>Secret Key</Text>

            <TextInput

export const useLoans = (walletAddress) => {              style={styles.textInput}

  const [loans, setLoans] = useState([]);              value={importSecret}

  const [loading, setLoading] = useState(false);              onChangeText={setImportSecret}

  const [error, setError] = useState(null);              placeholder="SXXX..."

              secureTextEntry

  const loadLoans = async () => {              multiline

    if (!walletAddress) return;              autoCapitalize="none"

              autoCorrect={false}

    try {            />

      setLoading(true);

      setError(null);            <View style={styles.modalButtons}>

      const response = await KrediClient.getLoanStatus(walletAddress);              <TouchableOpacity 

                      style={styles.secondaryButton}

      if (response.success) {                onPress={() => {

        setLoans(response.data.loans);                  setShowImportModal(false);

      }                  setImportSecret('');

    } catch (err) {                }}

      setError(err.message);              >

    } finally {                <Text style={styles.secondaryButtonText}>Cancelar</Text>

      setLoading(false);              </TouchableOpacity>

    }

  };              <TouchableOpacity 

                style={[styles.primaryButton, importLoading && styles.disabledButton]}

  const applyForLoan = async (applicationData) => {                onPress={handleImportWallet}

    try {                disabled={importLoading}

      setLoading(true);              >

      const response = await KrediClient.applyForLoan(applicationData);                {importLoading ? (

                        <ActivityIndicator color="#FFFFFF" />

      if (response.success) {                ) : (

        await loadLoans(); // Recargar préstamos                  <Text style={styles.primaryButtonText}>Importar</Text>

        return response.data;                )}

      }              </TouchableOpacity>

    } catch (err) {            </View>

      setError(err.message);          </View>

      throw err;        </View>

    } finally {      </Modal>

      setLoading(false);

    }      {error && (

  };        <Text style={styles.errorText}>{error}</Text>

      )}

  useEffect(() => {    </>

    loadLoans();  );

  }, [walletAddress]);};



  return {const styles = StyleSheet.create({

    loans,  connectedContainer: {

    loading,    flexDirection: 'row',

    error,    alignItems: 'center',

    loadLoans,    justifyContent: 'space-between',

    applyForLoan    backgroundColor: '#F0FDF4',

  };    padding: 12,

};    borderRadius: 8,

```    borderWidth: 1,

    borderColor: '#BBF7D0'

Esta guía te proporciona todo lo necesario para consumir correctamente las endpoints del backend desde tu frontend React Native, asegurando que la integración con los contratos Soroban funcione sin problemas.  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  walletDetails: {
    marginLeft: 8,
    flex: 1
  },
  connectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46'
  },
  addressText: {
    fontSize: 12,
    color: '#047857',
    fontFamily: 'monospace'
  },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  disconnectText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500'
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 48
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111827'
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280'
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280'
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600'
  },
  disabledButton: {
    opacity: 0.5
});

export default WalletConnector;
```

### Loan Application Component

```javascript
// src/components/LoanApplication.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useWallet } from '../hooks/useWallet';
import { useDispatch } from 'react-redux';
import { addLoanApplication } from '../store/slices/loansSlice';
import krediAPI from '../services/krediAPI';
import { APP_CONFIG } from '../config';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoanApplication = ({ navigation }) => {
  const { isConnected, wallet } = useWallet();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    repaymentDays: '7'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Monto es requerido';
    } else if (amount < APP_CONFIG.MIN_LOAN_AMOUNT) {
      newErrors.amount = `Monto mínimo: $${APP_CONFIG.MIN_LOAN_AMOUNT}`;
    } else if (amount > APP_CONFIG.MAX_LOAN_AMOUNT) {
      newErrors.amount = `Monto máximo: $${APP_CONFIG.MAX_LOAN_AMOUNT}`;
    }

    // Validate purpose
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Propósito es requerido';
    } else if (formData.purpose.trim().length < 10) {
      newErrors.purpose = 'Propósito debe tener al menos 10 caracteres';
    } else if (formData.purpose.trim().length > 500) {
      newErrors.purpose = 'Propósito muy largo (máximo 500 caracteres)';
    }

    // Validate repayment days
    const days = parseInt(formData.repaymentDays);
    if (!days || days < 1 || days > 30) {
      newErrors.repaymentDays = 'Plazo debe estar entre 1 y 30 días';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'Debes conectar tu wallet primero');
      return;
    }

    if (!validateForm()) {
      showErrorToast('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      const applicationData = {
        walletAddress: wallet.publicKey,
        loanAmount: parseFloat(formData.amount),
        purpose: formData.purpose.trim(),
        repaymentDays: parseInt(formData.repaymentDays)
      };

      const response = await krediAPI.applyForLoan(applicationData);

      if (response.success) {
        // Add to Redux store
        dispatch(addLoanApplication(response.data));
        
        // Show success
        showSuccessToast('Solicitud enviada exitosamente');
        
        // Show result modal
        Alert.alert(
          'Solicitud Enviada',
          `Tu solicitud de préstamo por $${formData.amount} ha sido ${response.data.status}.\n\nID: ${response.data.applicationId}`,
          [
            {
              text: 'Ver Mis Préstamos',
              onPress: () => navigation.navigate('LoanDashboard')
            },
            {
              text: 'OK',
              style: 'default'
            }
          ]
        );

        // Reset form
        setFormData({
          amount: '',
          purpose: '',
          repaymentDays: '7'
        });
      } else {
        showErrorToast(response.error || 'Error procesando solicitud');
      }
    } catch (error) {
      console.error('Loan application error:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Error procesando solicitud';
      
      Alert.alert('Error', errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // ... rest of component

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Component JSX here */}
    </KeyboardAvoidingView>
  );
};

export default LoanApplication;
```

---

## 6. Manejo de Estado con Redux Toolkit

### Store Configuration

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Slices
import walletSlice from './slices/walletSlice';
import loansSlice from './slices/loansSlice';
import appSlice from './slices/appSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['wallet', 'loans'] // Only persist these reducers
};

const rootReducer = combineReducers({
  wallet: walletSlice,
  loans: loansSlice,
  app: appSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Wallet Slice

```javascript
// src/store/slices/walletSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wallet: null,
  isConnected: false,
  loading: false,
  error: null,
  accountInfo: null
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload;
      state.isConnected = !!action.payload;
      state.error = null;
    },
    clearWallet: (state) => {
      state.wallet = null;
      state.isConnected = false;
      state.accountInfo = null;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAccountInfo: (state, action) => {
      state.accountInfo = action.payload;
    }
  }
});

export const { 
  setWallet, 
  clearWallet, 
  setLoading, 
  setError, 
  setAccountInfo 
} = walletSlice.actions;

export default walletSlice.reducer;
```

---

## 7. Navegación

### Navigator Setup

```javascript
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoanApplicationScreen from '../screens/LoanApplicationScreen';
import LoanDashboardScreen from '../screens/LoanDashboardScreen';
import WalletScreen from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Apply') {
          iconName = 'add-circle';
        } else if (route.name === 'Loans') {
          iconName = 'list';
        } else if (route.name === 'Wallet') {
          iconName = 'account-balance-wallet';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: '#6B7280',
      headerShown: true
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen 
      name="Apply" 
      component={LoanApplicationScreen}
      options={{ title: 'Solicitar' }}
    />
    <Tab.Screen 
      name="Loans" 
      component={LoanDashboardScreen}
      options={{ title: 'Mis Préstamos' }}
    />
    <Tab.Screen 
      name="Wallet" 
      component={WalletScreen}
      options={{ title: 'Wallet' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
```

---

## 8. Casos de Uso Completos

### Flujo de Aplicación de Préstamo

```javascript
// src/screens/LoanApplicationScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import LoanApplication from '../components/LoanApplication';
import { useWallet } from '../hooks/useWallet';

const LoanApplicationScreen = ({ navigation }) => {
  const { isConnected, accountExists, xlmBalance } = useWallet();

  useEffect(() => {
    // Check if user can apply for loan
    if (isConnected && !accountExists) {
      Alert.alert(
        'Cuenta No Encontrada',
        'Tu cuenta Stellar no existe o no tiene fondos. ¿Quieres financiarla en testnet?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Financiar', onPress: handleFundAccount }
        ]
      );
    }
  }, [isConnected, accountExists]);

  const handleFundAccount = async () => {
    // Fund testnet account logic
    try {
      await walletService.fundTestnetAccount(wallet.publicKey);
      showSuccessToast('Cuenta financiada exitosamente');
    } catch (error) {
      showErrorToast('Error financiando cuenta');
    }
  };

  return (
    <View style={styles.container}>
      <LoanApplication navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LoanApplicationScreen;
```

### Utilidades y Helpers

```javascript
// src/utils/toast.js
import Toast from 'react-native-toast-message';

export const showSuccessToast = (message) => {
  Toast.show({
    type: 'success',
    text1: 'Éxito',
    text2: message,
    visibilityTime: 4000
  });
};

export const showErrorToast = (message) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    visibilityTime: 4000
  });
};

export const showInfoToast = (message) => {
  Toast.show({
    type: 'info',
    text1: 'Información',
    text2: message,
    visibilityTime: 3000
  });
};
```

---

## 🚀 Comandos de Inicio Rápido

```bash
# Instalar dependencias
npm install

# iOS
npx pod-install
npx react-native run-ios

# Android
npx react-native run-android

# Metro bundler
npx react-native start --reset-cache
```

---

## 📝 Próximos Pasos

1. **Agregar más validaciones** de seguridad
2. **Implementar notificaciones push** para estados de préstamo
3. **Añadir biometría** para autenticación
4. **Integrar con wallets externas** (Freighter, Lobstr)
5. **Implementar deep linking** para pagos
6. **Agregar analytics** y crash reporting
7. **Tests unitarios e integración**
8. **CI/CD pipeline** para deployments

---

## 🔐 Consideraciones de Seguridad

- **Secret keys** se almacenan en Keychain/Keystore
- **Validaciones** tanto en frontend como backend
- **Rate limiting** para API calls
- **Input sanitization** para prevenir inyecciones
- **SSL pinning** para comunicaciones API
- **Obfuscación** de código para producción

export default WalletConnector;

```
```

### 2. **API Service Layer**

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejo de errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const krediAPI = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Aplicar para préstamo
  applyForLoan: async (applicationData) => {
    const response = await api.post('/api/apply', applicationData);
    return response.data;
  },

  // Consultar estado de préstamos
  getLoanStatus: async (walletAddress) => {
    const response = await api.get(`/api/status/${walletAddress}`);
    return response.data;
  },

  // Desembolsar préstamo (solo admin)
  disburseLoan: async (disburseData, adminToken) => {
    const response = await api.post('/api/disburse', disburseData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    return response.data;
  }
};

export default api;
```

### 3. **Wallet Integration Hook**

```javascript
// src/hooks/useWallet.js
import { useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Detectar wallets disponibles
  const detectWallets = () => {
    const wallets = [];
    
    if (window.freighter) {
      wallets.push({ name: 'Freighter', id: 'freighter' });
    }
    
    if (window.albedo) {
      wallets.push({ name: 'Albedo', id: 'albedo' });
    }
    
    return wallets;
  };

  // Conectar con Freighter
  const connectFreighter = async () => {
    try {
      if (!window.freighter) {
        throw new Error('Freighter wallet no está instalado');
      }

      await window.freighter.requestAccess();
      const publicKey = await window.freighter.getPublicKey();
      
      return {
        publicKey,
        provider: 'freighter',
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Error conectando Freighter: ${error.message}`);
    }
  };

  // Conectar con Albedo
  const connectAlbedo = async () => {
    try {
      if (!window.albedo) {
        throw new Error('Albedo wallet no está disponible');
      }

      const result = await window.albedo.publicKey();
      
      return {
        publicKey: result.pubkey,
        provider: 'albedo',
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Error conectando Albedo: ${error.message}`);
    }
  };

  // Conectar wallet
  const connectWallet = async (walletId) => {
    setConnecting(true);
    setError(null);

    try {
      let walletData;
      
      switch (walletId) {
        case 'freighter':
          walletData = await connectFreighter();
          break;
        case 'albedo':
          walletData = await connectAlbedo();
          break;
        default:
          throw new Error('Wallet no soportado');
      }

      setWallet(walletData);
      localStorage.setItem('connectedWallet', JSON.stringify(walletData));
      
      return walletData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setWallet(null);
    setError(null);
    localStorage.removeItem('connectedWallet');
  };

  // Restaurar wallet desde localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWallet(walletData);
      } catch (error) {
        console.error('Error restaurando wallet:', error);
        localStorage.removeItem('connectedWallet');
      }
    }
  }, []);

  return {
    wallet,
    connecting,
    error,
    detectWallets,
    connectWallet,
    disconnectWallet,
    isConnected: !!wallet?.isConnected
  };
};
```

### 4. **Loan Application Component**

```javascript
// src/components/LoanApplication.jsx
import React, { useState } from 'react';
import { krediAPI } from '../services/api';
import { useWallet } from '../hooks/useWallet';

const LoanApplication = () => {
  const { wallet, isConnected } = useWallet();
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    termDays: '15'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount < 50 || formData.amount > 10000) {
      newErrors.amount = 'Monto debe estar entre $50 y $10,000';
    }

    if (!formData.purpose || formData.purpose.length < 10) {
      newErrors.purpose = 'Propósito debe tener al menos 10 caracteres';
    }

    if (!formData.termDays || formData.termDays < 7 || formData.termDays > 30) {
      newErrors.termDays = 'Plazo debe estar entre 7 y 30 días';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setResult({ success: false, error: 'Debes conectar tu wallet primero' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const applicationData = {
        walletAddress: wallet.publicKey,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        termDays: parseInt(formData.termDays)
      };

      const response = await krediAPI.applyForLoan(applicationData);
      
      setResult({
        success: true,
        data: response
      });

      // Limpiar formulario
      setFormData({ amount: '', purpose: '', termDays: '15' });
      
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.message || error.message || 'Error al procesar solicitud'
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ Debes conectar tu wallet Stellar para aplicar a un préstamo
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Solicitar Préstamo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Monto */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Monto ($50 - $10,000)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="50"
            max="10000"
            step="1"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="500"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Propósito */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Propósito del Préstamo
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows="3"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.purpose ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe para qué necesitas el préstamo..."
          />
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
          )}
        </div>

        {/* Plazo */}
        <div>
          <label htmlFor="termDays" className="block text-sm font-medium text-gray-700">
            Plazo (7 - 30 días)
          </label>
          <select
            id="termDays"
            name="termDays"
            value={formData.termDays}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.termDays ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="7">7 días</option>
            <option value="15">15 días</option>
            <option value="21">21 días</option>
            <option value="30">30 días</option>
          </select>
          {errors.termDays && (
            <p className="mt-1 text-sm text-red-600">{errors.termDays}</p>
          )}
        </div>

        {/* Información del wallet */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            <strong>Wallet:</strong> {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Provider:</strong> {wallet.provider}
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            'Solicitar Préstamo'
          )}
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <div>
              <h3 className="text-lg font-medium text-green-800 mb-2">
                ✅ Solicitud Enviada
              </h3>
              <div className="text-sm text-green-700">
                <p><strong>Loan ID:</strong> {result.data.loanId}</p>
                <p><strong>Estado:</strong> {result.data.status}</p>
                {result.data.approvedAmount && (
                  <p><strong>Monto Aprobado:</strong> ${result.data.approvedAmount}</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                ❌ Error en Solicitud
              </h3>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanApplication;
```

### 5. **Wallet Connection Component**

```javascript
// src/components/WalletConnector.jsx
import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnector = () => {
  const { 
    wallet, 
    connecting, 
    error, 
    detectWallets, 
    connectWallet, 
    disconnectWallet, 
    isConnected 
  } = useWallet();
  
  const [showOptions, setShowOptions] = useState(false);
  const availableWallets = detectWallets();

  const handleConnect = async (walletId) => {
    try {
      await connectWallet(walletId);
      setShowOptions(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Conectado con {wallet.provider}
          </p>
          <p className="text-xs text-green-600">
            {wallet.publicKey.slice(0, 12)}...{wallet.publicKey.slice(-12)}
          </p>
        </div>
        <button
          onClick={disconnectWallet}
          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          disabled={connecting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {connecting ? 'Conectando...' : 'Conectar Wallet'}
        </button>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selecciona tu wallet:</h3>
          
          {availableWallets.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ No se detectaron wallets Stellar instalados
              </p>
              <div className="mt-2 space-y-1">
                <a 
                  href="https://freighter.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 block"
                >
                  📥 Descargar Freighter Wallet
                </a>
                <a 
                  href="https://albedo.link/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 block"
                >
                  🌐 Usar Albedo (Web Wallet)
                </a>
              </div>
            </div>
          ) : (
            availableWallets.map((walletOption) => (
              <button
                key={walletOption.id}
                onClick={() => handleConnect(walletOption.id)}
                disabled={connecting}
                className="w-full p-3 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <div className="font-medium text-gray-900">{walletOption.name}</div>
                <div className="text-sm text-gray-500">
                  {walletOption.id === 'freighter' && 'Extensión de navegador'}
                  {walletOption.id === 'albedo' && 'Web wallet'}
                </div>
              </button>
            ))
          )}
          
          <button
            onClick={() => setShowOptions(false)}
            className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">❌ {error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
```

### 6. **Loan Status Dashboard**

```javascript
// src/components/LoanDashboard.jsx
import React, { useState, useEffect } from 'react';
import { krediAPI } from '../services/api';
import { useWallet } from '../hooks/useWallet';

const LoanDashboard = () => {
  const { wallet, isConnected } = useWallet();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar estado de préstamos
  const loadLoanStatus = async () => {
    if (!isConnected || !wallet?.publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await krediAPI.getLoanStatus(wallet.publicKey);
      setLoans(response.loans || []);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refrescar datos
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLoanStatus();
    setRefreshing(false);
  };

  // Cargar al montar y cuando cambie el wallet
  useEffect(() => {
    loadLoanStatus();
  }, [wallet?.publicKey, isConnected]);

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'repaid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ Conecta tu wallet para ver el estado de tus préstamos
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Estado de Préstamos
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-blue-700 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                '🔄 Actualizar'
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            Wallet: {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Cargando préstamos...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">❌ Error: {error}</p>
              <button 
                onClick={loadLoanStatus}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes préstamos
              </h3>
              <p className="text-gray-600">
                Aplica para tu primer préstamo para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan, index) => (
                <div key={loan.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          ${loan.amount || 'N/A'}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                          {loan.status || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Propósito:</span>
                          <p>{loan.purpose || 'No especificado'}</p>
                        </div>
                        <div>
                          <span className="font-medium">ID del Préstamo:</span>
                          <p className="font-mono">{loan.id || loan.loanId || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Fecha de Solicitud:</span>
                          <p>{loan.applicationDate ? formatDate(loan.applicationDate) : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Fecha de Vencimiento:</span>
                          <p>{loan.dueDate ? formatDate(loan.dueDate) : 'N/A'}</p>
                        </div>
                      </div>

                      {loan.interestRate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Tasa de Interés:</span> {loan.interestRate}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;
```

### 7. **Main App Component**

```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WalletConnector from './components/WalletConnector';
import LoanApplication from './components/LoanApplication';
import LoanDashboard from './components/LoanDashboard';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isConnected } = useWallet();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  Kredi
                </Link>
                <div className="ml-10 space-x-4">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Inicio
                  </Link>
                  {isConnected && (
                    <>
                      <Link 
                        to="/apply" 
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Solicitar Préstamo
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Mis Préstamos
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <WalletConnector />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apply" element={<LoanApplication />} />
              <Route path="/dashboard" element={<LoanDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

// HomePage Component
const HomePage = () => {
  const { isConnected } = useWallet();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Bienvenido a Kredi
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Plataforma de micro-préstamos descentralizada en Stellar
      </p>
      
      {!isConnected ? (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Conecta tu Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Para comenzar a usar Kredi, conecta tu wallet Stellar
          </p>
          <WalletConnector />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Solicitar Préstamo
            </h3>
            <p className="text-gray-600 mb-4">
              Aplica para un micro-préstamo de hasta $10,000
            </p>
            <Link 
              to="/apply"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Ahora
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Mis Préstamos
            </h3>
            <p className="text-gray-600 mb-4">
              Ve el estado de tus préstamos activos
            </p>
            <Link 
              to="/dashboard"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
```

## 🔧 Quick Start Commands

```bash
# Clonar el ejemplo
git clone <frontend-repo>
cd kredi-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus URLs

# Iniciar en desarrollo
npm start

# Build para producción
npm run build
```

## 📱 Próximos Pasos

1. **Añadir más validaciones** en el frontend
2. **Implementar notificaciones** en tiempo real
3. **Añadir gráficos** para analytics
4. **Integrar con más wallets** (Lobstr, XBULL)
5. **Añadir modo offline** con localStorage
6. **Implementar PWA** para móviles
