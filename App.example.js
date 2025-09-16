// App.js - Configuración principal con Redux y Toast
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MainNavigator from './src/navigation/MainNavigator';
import { persistor, store } from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        } 
        persistor={persistor}
      >
        <MainNavigator />
        <Toast />
      </PersistGate>
    </Provider>
  );
};

export default App;