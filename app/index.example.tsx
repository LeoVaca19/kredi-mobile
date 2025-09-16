// Ejemplo de integración en pantalla existente
// app/index.tsx (modificado para incluir integración Kredi)

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// Importar componentes de integración Kredi
import WalletConnector from '@/src/components/WalletConnector';
import { useWallet } from '@/src/hooks/useWallet';
import krediAPI from '@/src/services/krediAPI';

const { width } = Dimensions.get('window');

// Simple Stellar address validation
const isValidStellarAddress = (address: string): boolean => {
  return /^G[A-Z2-7]{55}$/.test(address);
};

export default function HomeScreen() {
  // Estado local simple para el ejemplo (reemplaza useUser)
  const [user, setUser] = useState<{address: string; name: string; isConnected: boolean} | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  
  // Nuevo: Estado de integración Kredi
  const { isConnected, xlmBalance, publicKey } = useWallet();
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'healthy' | 'error'>('unknown');

  // Nuevo: Verificar backend al cargar
  React.useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await krediAPI.healthCheck();
      setBackendStatus(health.status === 'healthy' ? 'healthy' : 'error');
    } catch {
      setBackendStatus('error');
    }
  };

  const handleQuickAccess = () => {
    if (isConnected && publicKey) {
      // Si hay wallet conectada de Kredi, usarla
      setUser({ 
        address: publicKey,
        name: `Usuario ${publicKey.slice(0, 6)}...`,
        isConnected: true 
      });
      router.push('/home');
    } else if (user?.address) {
      // Si hay usuario existente, continuar
      router.push('/home');
    } else {
      // Mostrar modal para configurar
      setModalVisible(true);
    }
  };

  const handleManualSubmit = () => {
    if (manualAddress.trim() && isValidStellarAddress(manualAddress.trim())) {
      setUser({ 
        address: manualAddress.trim(),
        name: `Usuario ${manualAddress.slice(0, 6)}...`,
        isConnected: false 
      });
      setModalVisible(false);
      setManualAddress('');
      router.push('/home');
    } else {
      Alert.alert('Error', 'Por favor ingresa una dirección Stellar válida');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/splash-icon.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header existente */}
          <View style={styles.header}>
            <Text style={styles.title}>Kredi</Text>
            <Text style={styles.subtitle}>
              Plataforma de Microcréditos en Blockchain
            </Text>
            
            {/* Nuevo: Indicador de estado del backend */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: 
                  backendStatus === 'healthy' ? '#10B981' : 
                  backendStatus === 'error' ? '#EF4444' : '#6B7280' 
                }
              ]} />
              <Text style={styles.statusText}>
                Backend: {
                  backendStatus === 'healthy' ? 'Conectado' : 
                  backendStatus === 'error' ? 'Error' : 'Verificando...'
                }
              </Text>
            </View>
          </View>

          {/* Nuevo: Sección de Wallet Kredi */}
          <View style={styles.walletSection}>
            <Text style={styles.sectionTitle}>Wallet Stellar</Text>
            <WalletConnector />
            
            {isConnected && (
              <View style={styles.walletInfo}>
                <Text style={styles.walletBalance}>
                  Balance: {xlmBalance.toFixed(2)} XLM
                </Text>
                <Text style={styles.walletAddress}>
                  {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                </Text>
              </View>
            )}
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <Pressable style={styles.primaryButton} onPress={handleQuickAccess}>
              <Ionicons name="rocket" size={24} color="white" />
              <Text style={styles.primaryButtonText}>
                {isConnected ? 'Continuar con Wallet' : 'Acceso Rápido'}
              </Text>
            </Pressable>

            {!isConnected && (
              <Pressable 
                style={styles.secondaryButton} 
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="person-add" size={24} color="#3B82F6" />
                <Text style={styles.secondaryButtonText}>
                  Configurar Manualmente
                </Text>
              </Pressable>
            )}
          </View>

          {/* Usuario actual */}
          {user?.address && (
            <View style={styles.currentUser}>
              <Text style={styles.currentUserLabel}>Usuario Actual:</Text>
              <Text style={styles.currentUserAddress}>{user.address}</Text>
              <Text style={styles.currentUserStatus}>
                {isConnected ? '🟢 Wallet Conectada' : '🔴 Modo Manual'}
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Modal existente para configuración manual */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar Dirección</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            <Text style={styles.modalDescription}>
              Ingresa tu dirección Stellar para continuar
            </Text>

            <TextInput
              style={styles.addressInput}
              placeholder="GXXX... (dirección Stellar)"
              value={manualAddress}
              onChangeText={setManualAddress}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              
              <Pressable
                style={styles.confirmButton}
                onPress={handleManualSubmit}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Nuevos estilos para integración Kredi
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  walletSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  walletInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  walletBalance: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletAddress: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  
  actionButtons: {
    gap: 16,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  currentUser: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentUserLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  currentUserAddress: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  currentUserStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Estilos del modal (existentes)
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});