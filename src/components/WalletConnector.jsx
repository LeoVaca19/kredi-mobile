import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWallet } from '../hooks/useWallet';

const WalletConnector = () => {
  const { 
    wallet, 
    loading, 
    error, 
    isConnected, 
    createWallet, 
    importWallet, 
    disconnectWallet,
    shortPublicKey 
  } = useWallet();
  
  const [showOptions, setShowOptions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSecret, setImportSecret] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      setShowOptions(false);
    } catch (_error) {
      console.error('Error creating wallet:', _error);
    }
  };

  const handleImportWallet = async () => {
    if (!importSecret.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu secret key');
      return;
    }

    try {
      setImportLoading(true);
      await importWallet(importSecret.trim());
      setShowImportModal(false);
      setShowOptions(false);
      setImportSecret('');
    } catch (_error) {
      Alert.alert('Error', 'Secret key inválida');
    } finally {
      setImportLoading(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Desconectar Wallet',
      '¿Estás seguro de que quieres desconectar tu wallet?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desconectar', onPress: disconnectWallet, style: 'destructive' }
      ]
    );
  };

  if (isConnected && wallet) {
    return (
      <View style={styles.connectedContainer}>
        <View style={styles.walletInfo}>
          <Icon name="account-balance-wallet" size={24} color="#10B981" />
          <View style={styles.walletDetails}>
            <Text style={styles.connectedText}>Wallet Conectada</Text>
            <Text style={styles.addressText}>{shortPublicKey}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.disconnectButton} 
          onPress={handleDisconnect}
        >
          <Text style={styles.disconnectText}>Desconectar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => setShowOptions(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Icon name="account-balance-wallet" size={20} color="#FFFFFF" />
            <Text style={styles.connectButtonText}>Conectar Wallet</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conectar Wallet</Text>
            
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleCreateWallet}
            >
              <Icon name="add-circle" size={24} color="#3B82F6" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Crear Nueva Wallet</Text>
                <Text style={styles.optionDescription}>
                  Genera una nueva wallet Stellar
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                setShowImportModal(true);
              }}
            >
              <Icon name="file-download" size={24} color="#3B82F6" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Importar Wallet</Text>
                <Text style={styles.optionDescription}>
                  Usa tu secret key existente
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Importar Wallet</Text>
            
            <Text style={styles.inputLabel}>Secret Key</Text>
            <TextInput
              style={styles.textInput}
              value={importSecret}
              onChangeText={setImportSecret}
              placeholder="SXXX..."
              secureTextEntry
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setShowImportModal(false);
                  setImportSecret('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.primaryButton, importLoading && styles.disabledButton]}
                onPress={handleImportWallet}
                disabled={importLoading}
              >
                {importLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Importar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
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
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8
  }
});

export default WalletConnector;