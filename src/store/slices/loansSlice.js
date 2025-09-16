import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loans: [],
  applications: [],
  activeLoans: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoans: (state, action) => {
      state.loans = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    addLoanApplication: (state, action) => {
      state.applications.push(action.payload);
    },
    updateLoanApplication: (state, action) => {
      const { applicationId, updates } = action.payload;
      const index = state.applications.findIndex(app => app.id === applicationId);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...updates };
      }
    },
    setActiveLoans: (state, action) => {
      state.activeLoans = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLoans: (state) => {
      state.loans = [];
      state.applications = [];
      state.activeLoans = [];
      state.error = null;
    }
  }
});

export const { 
  setLoans, 
  addLoanApplication, 
  updateLoanApplication,
  setActiveLoans,
  setLoading, 
  setError, 
  clearError,
  clearLoans 
} = loansSlice.actions;

export default loansSlice.reducer;