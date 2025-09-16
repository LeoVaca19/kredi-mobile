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
      state.isConnected = true;
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
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setWallet, 
  clearWallet, 
  setLoading, 
  setError, 
  setAccountInfo,
  clearError 
} = walletSlice.actions;

export default walletSlice.reducer;