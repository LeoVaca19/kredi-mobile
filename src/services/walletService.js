import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keypair, Networks, Server } from '@stellar/stellar-sdk';
import Keychain from 'react-native-keychain';
import { STELLAR_CONFIG } from '../config';

class WalletService {
  constructor() {
    this.server = new Server(STELLAR_CONFIG.HORIZON_URL);
    this.network = STELLAR_CONFIG.NETWORK === 'testnet' 
      ? Networks.TESTNET 
      : Networks.PUBLIC;
  }

  // Generate new wallet
  async generateWallet() {
    try {
      const keypair = Keypair.random();
      const walletData = {
        publicKey: keypair.publicKey(),
        secretKey: keypair.secret(),
        createdAt: new Date().toISOString()
      };

      return walletData;
    } catch (error) {
      throw new Error(`Error generando wallet: ${error.message}`);
    }
  }

  // Save wallet securely
  async saveWallet(walletData) {
    try {
      // Save secret key in Keychain (secure)
      await Keychain.setInternetCredentials(
        'kredi_wallet',
        walletData.publicKey,
        walletData.secretKey
      );

      // Save public data in AsyncStorage
      const publicWalletData = {
        publicKey: walletData.publicKey,
        createdAt: walletData.createdAt,
        isSecured: true
      };

      await AsyncStorage.setItem('wallet_data', JSON.stringify(publicWalletData));
      await AsyncStorage.setItem('current_wallet', walletData.publicKey);

      return publicWalletData;
    } catch (error) {
      throw new Error(`Error guardando wallet: ${error.message}`);
    }
  }

  // Load wallet
  async loadWallet() {
    try {
      const currentWallet = await AsyncStorage.getItem('current_wallet');
      if (!currentWallet) return null;

      const walletData = await AsyncStorage.getItem('wallet_data');
      if (!walletData) return null;

      return JSON.parse(walletData);
    } catch (error) {
      console.error('Error cargando wallet:', error);
      return null;
    }
  }

  // Get secret key (requires authentication)
  async getSecretKey(publicKey) {
    try {
      const credentials = await Keychain.getInternetCredentials('kredi_wallet');
      if (credentials && credentials.username === publicKey) {
        return credentials.password;
      }
      throw new Error('Secret key no encontrada');
    } catch (error) {
      throw new Error(`Error obteniendo secret key: ${error.message}`);
    }
  }

  // Import existing wallet
  async importWallet(secretKey) {
    try {
      const keypair = Keypair.fromSecret(secretKey);
      const walletData = {
        publicKey: keypair.publicKey(),
        secretKey: secretKey,
        createdAt: new Date().toISOString()
      };

      return walletData;
    } catch (error) {
      throw new Error(`Secret key inválida: ${error.message}`);
    }
  }

  // Get account info
  async getAccountInfo(publicKey) {
    try {
      const account = await this.server.loadAccount(publicKey);
      return {
        accountId: account.accountId(),
        sequenceNumber: account.sequenceNumber(),
        balances: account.balances,
        signers: account.signers,
        thresholds: account.thresholds
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // Account doesn't exist
      }
      throw error;
    }
  }

  // Get balance for specific asset
  getAssetBalance(balances, assetCode = 'native') {
    if (assetCode === 'native' || assetCode === 'XLM') {
      const nativeBalance = balances.find(b => b.asset_type === 'native');
      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    }

    const assetBalance = balances.find(b => 
      b.asset_type !== 'native' && 
      b.asset_code === assetCode
    );
    return assetBalance ? parseFloat(assetBalance.balance) : 0;
  }

  // Fund testnet account
  async fundTestnetAccount(publicKey) {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (!response.ok) {
        throw new Error('Error funding account');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error funding testnet account: ${error.message}`);
    }
  }

  // Clear wallet data
  async clearWallet() {
    try {
      await Keychain.resetInternetCredentials('kredi_wallet');
      await AsyncStorage.removeItem('wallet_data');
      await AsyncStorage.removeItem('current_wallet');
    } catch (error) {
      console.error('Error clearing wallet:', error);
    }
  }

  // Validate public key format
  static isValidPublicKey(publicKey) {
    try {
      Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  // Validate secret key format
  static isValidSecretKey(secretKey) {
    try {
      Keypair.fromSecret(secretKey);
      return true;
    } catch {
      return false;
    }
  }
}

export default new WalletService();