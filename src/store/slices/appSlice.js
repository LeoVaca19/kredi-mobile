import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  isLoading: false,
  theme: 'light',
  language: 'es',
  backendStatus: 'unknown',
  systemInfo: null,
  errors: []
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setBackendStatus: (state, action) => {
      state.backendStatus = action.payload;
    },
    setSystemInfo: (state, action) => {
      state.systemInfo = action.payload;
    },
    addError: (state, action) => {
      state.errors.push({
        id: Date.now(),
        message: action.payload,
        timestamp: new Date().toISOString()
      });
    },
    removeError: (state, action) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    }
  }
});

export const { 
  setConnected, 
  setLoading, 
  setTheme, 
  setLanguage,
  setBackendStatus,
  setSystemInfo,
  addError,
  removeError,
  clearErrors 
} = appSlice.actions;

export default appSlice.reducer;