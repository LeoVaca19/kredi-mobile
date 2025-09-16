import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// Slices
import appSlice from './slices/appSlice';
import loansSlice from './slices/loansSlice';
import walletSlice from './slices/walletSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['wallet', 'loans'], // Only persist these reducers
  blacklist: ['app'] // Don't persist app state
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

// Tipos removidos para archivo JS - usar en archivo TS si es necesario
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;