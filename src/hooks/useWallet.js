import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STELLAR_CONFIG } from '../config';
import walletService from '../services/walletService';
import { clearWallet, setAccountInfo, setError, setLoading, setWallet } from '../store/slices/walletSlice';
import { showErrorToast, showSuccessToast } from '../utils/toast';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { wallet, loading, error, isConnected, accountInfo } = useSelector(state => state.wallet);
  const [refreshing, setRefreshing] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const walletData = await walletService.loadWallet();
      if (walletData) {
        dispatch(setWallet(walletData));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const loadAccountInfo = useCallback(async () => {
    if (!wallet?.publicKey) return;

    try {
      const info = await walletService.getAccountInfo(wallet.publicKey);
      dispatch(setAccountInfo(info));
    } catch (err) {
      console.error('Error loading account info:', err);
      dispatch(setAccountInfo(null));
    }
  }, [wallet?.publicKey, dispatch]);

  // Load wallet on mount
  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  // Load account info when wallet changes
  useEffect(() => {
    if (wallet?.publicKey) {
      loadAccountInfo();
    }
  }, [wallet?.publicKey, loadAccountInfo]);

  const createWallet = async () => {
    try {
      dispatch(setLoading(true));
      
      const newWallet = await walletService.generateWallet();
      const savedWallet = await walletService.saveWallet(newWallet);
      
      dispatch(setWallet(savedWallet));
      
      // Fund testnet account if on testnet
      if (STELLAR_CONFIG.NETWORK === 'testnet') {
        try {
          await walletService.fundTestnetAccount(savedWallet.publicKey);
          showSuccessToast('Wallet creado y financiado en testnet');
        } catch (_fundError) {
          showErrorToast('Wallet creado, pero no se pudo financiar en testnet');
        }
      } else {
        showSuccessToast('Wallet creado exitosamente');
      }

      return savedWallet;
    } catch (error) {
      const errorMessage = error.message || 'Error creando wallet';
      dispatch(setError(errorMessage));
      showErrorToast(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const importWallet = async (secretKey) => {
    try {
      dispatch(setLoading(true));
      
      const importedWallet = await walletService.importWallet(secretKey);
      const savedWallet = await walletService.saveWallet(importedWallet);
      
      dispatch(setWallet(savedWallet));
      showSuccessToast('Wallet importado exitosamente');

      return savedWallet;
    } catch (error) {
      const errorMessage = error.message || 'Error importando wallet';
      dispatch(setError(errorMessage));
      showErrorToast(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.clearWallet();
      dispatch(clearWallet());
      showSuccessToast('Wallet desconectado');
    } catch (_error) {
      showErrorToast('Error desconectando wallet');
    }
  };

  const refreshAccount = async () => {
    setRefreshing(true);
    await loadAccountInfo();
    setRefreshing(false);
  };

  const getBalance = useCallback((assetCode = 'XLM') => {
    if (!accountInfo?.balances) return 0;
    return walletService.getAssetBalance(accountInfo.balances, assetCode);
  }, [accountInfo]);

  const getSecretKey = async () => {
    if (!wallet?.publicKey) {
      throw new Error('No wallet connected');
    }
    try {
      return await walletService.getSecretKey(wallet.publicKey);
    } catch (_error) {
      throw new Error('Error obteniendo secret key');
    }
  };

  return {
    // State
    wallet,
    loading,
    error,
    isConnected,
    accountInfo,
    refreshing,
    
    // Actions
    createWallet,
    importWallet,
    disconnectWallet,
    refreshAccount,
    loadAccountInfo,
    getSecretKey,

    // Utils
    getBalance,

    // Computed
    xlmBalance: getBalance('XLM'),
    usdcBalance: getBalance('USDC'),
    accountExists: !!accountInfo,
    publicKey: wallet?.publicKey,
    shortPublicKey: wallet?.publicKey ? 
      `${wallet.publicKey.slice(0, 4)}...${wallet.publicKey.slice(-4)}` : null
  };
};