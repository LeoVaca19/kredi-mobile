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

export const showWarningToast = (message) => {
  Toast.show({
    type: 'info',
    text1: 'Advertencia',
    text2: message,
    visibilityTime: 3000
  });
};