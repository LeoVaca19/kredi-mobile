# Instalación de Dependencias - Kredi Mobile

Este script instala todas las dependencias necesarias para la integración completa con el backend de Kredi.

## Dependencias Principales

### Core React Native

```bash
npm install react-native-screens react-native-safe-area-context
```

### HTTP Client & Estado

```bash
npm install axios @reduxjs/toolkit react-redux redux-persist
```

### Stellar SDK

```bash
npm install @stellar/stellar-sdk
```

### Storage & Seguridad

```bash
npm install @react-native-async-storage/async-storage react-native-keychain
```

### UI & Styling

```bash
npm install react-native-vector-icons react-native-toast-message
```

### Configuración

```bash
npm install react-native-config
```

### Crypto & Utils

```bash
npm install react-native-crypto react-native-get-random-values
```

### Navegación (opcional)

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
```

### DevDependencies

```bash
npm install --save-dev @types/react-native
```

## Comando Completo

Ejecuta este comando para instalar todas las dependencias de una vez:

```bash
npm install react-native-screens react-native-safe-area-context axios @reduxjs/toolkit react-redux redux-persist @stellar/stellar-sdk @react-native-async-storage/async-storage react-native-keychain react-native-vector-icons react-native-toast-message react-native-config react-native-crypto react-native-get-random-values @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack --save-dev @types/react-native
```

## Configuración Adicional

### iOS (después de instalar dependencias)

```bash
cd ios && pod install && cd ..
```

### Android

Asegúrate de que `android/settings.gradle` incluya:

```gradle
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
```

### Metro Config (react-native.config.js)

```javascript
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          icons: ['MaterialIcons', 'Ionicons', 'FontAwesome']
        }
      }
    }
  }
};
```

## Post-instalación

1. **Configurar variables de entorno**: Copia y edita el archivo `.env`
2. **Configurar iconos**: Ejecuta `npx react-native link react-native-vector-icons`
3. **Limpiar y rebuild**:

   ```bash
   npx react-native start --reset-cache
   npx react-native run-android # o run-ios
   ```

## Verificación

Para verificar que todas las dependencias están instaladas correctamente:

```javascript
// Test de importaciones
import { Keypair } from '@stellar/stellar-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

console.log('✅ Todas las dependencias cargadas correctamente');
```
