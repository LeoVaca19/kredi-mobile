import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Simple Stellar address validation
const isValidStellarAddress = (address: string): boolean => {
  return /^G[A-Z2-7]{55}$/.test(address);
};

// Component that conditionally uses BlurView or fallback View
const ConditionalBlurView = ({ children, intensity, tint, style, fallbackStyle }: {
  children: React.ReactNode;
  intensity: number;
  tint: 'light' | 'dark';
  style: any;
  fallbackStyle?: any;
}) => {
  if (Platform.OS === 'web') {
    return (
      <BlurView intensity={intensity} style={style} tint={tint}>
        {children}
      </BlurView>
    );
  }
  
  // Fallback for mobile (Expo Go)
  return (
    <View style={[style, fallbackStyle]}>
      {children}
    </View>
  );
};

export default function WelcomeScreen() {
  const { setPublicKey: setGlobalPublicKey } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const handleConnect = async () => {
    if (!publicKey.trim()) {
      Alert.alert('Error', 'Por favor ingresa una dirección pública de Stellar');
      return;
    }

    if (!isValidStellarAddress(publicKey.trim())) {
      Alert.alert('Error', 'La dirección pública no es válida. Debe comenzar con "G" y tener 56 caracteres.');
      return;
    }

    setConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Conectado con dirección:', publicKey.trim());
      
      // Save to global context
      setGlobalPublicKey(publicKey.trim());
      
      setConnectionSuccess(true);
      
      // Show success message for 2 seconds, then navigate
      setTimeout(() => {
        setModalVisible(false);
        setConnectionSuccess(false);
        
        // Navigate to home (no need to pass params anymore)
        router.push('/home');
      }, 2000);
    } catch (error) {
      console.error('Error al conectar:', error);
      Alert.alert('Error', 'No se pudo conectar. Intenta nuevamente.');
    } finally {
      setConnecting(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      if (Platform.OS !== 'web') {
        const clipboardText = await Clipboard.getString();
        if (clipboardText && isValidStellarAddress(clipboardText.trim())) {
          setPublicKey(clipboardText.trim());
          Alert.alert('Éxito', 'Dirección pública pegada desde el portapapeles');
        } else {
          Alert.alert('Error', 'El contenido del portapapeles no es una dirección Stellar válida');
        }
      } else {
        Alert.alert(
          'Pegar desde portapapeles', 
          'Usa Ctrl+V para pegar tu dirección pública de Stellar en el campo de texto.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error accessing clipboard:', error);
      Alert.alert('Error', 'No se pudo acceder al portapapeles');
    }
  };

  const clearField = () => {
    setPublicKey('');
  };

  const openQRScanner = () => {
    Alert.alert(
      'Escáner QR', 
      'El escáner QR se implementará en una futura versión. Por ahora, puedes pegar tu dirección manualmente.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZmj_JuSeYfEHu1pzDy0ImAf2M9NQouht3Wn21h632Yvt0zeqK6r2xM1UUpG2BQZ3isspYpLypVtS_N-erFGcFWGdmx6Qksf7YT6lqRMaEUiXxrmdiNqPAOy-K3pR2REczIPeNVQc3g3fYhltigalNElE3V9bqBtTyOHOTCQzn7-yHFCMjmFcVB2pMGdckiYJ2jK1t83rYPuQDfWAv0ZefBHPAqTNs3L06gwlmgvlnSMXdaVMkIOvZL3KF-MVQcyTUJA_9NQA5mhw',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay */}
        <ConditionalBlurView 
          intensity={20} 
          style={styles.overlay} 
          tint="light"
          fallbackStyle={styles.overlayFallback}
        >
          <View style={styles.overlayColor} />
        </ConditionalBlurView>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.mainCard}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Kredi</Text>
                <Text style={styles.subtitle}>Decentralized Lending, Powered by Trust</Text>
              </View>

              {/* Login Card */}
              <ConditionalBlurView 
                intensity={30} 
                style={styles.loginCard} 
                tint="light"
                fallbackStyle={styles.loginCardFallback}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Connect to Kredi</Text>
                  <Text style={styles.cardSubtitle}>
                    Secure, self-custodied access to decentralized lending
                  </Text>

                  {/* Connect Wallet Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.connectButton,
                      pressed && styles.connectButtonPressed,
                    ]}
                    onPress={() => setModalVisible(true)}
                  >
                    <LinearGradient
                      colors={['#4A90E2', '#50E3C2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradient}
                    >
                      <Text style={styles.connectButtonText}>Connect Wallet</Text>
                    </LinearGradient>
                  </Pressable>

                  {/* Security Features */}
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Ionicons name="lock-closed" size={16} color="#6B6864" />
                      <Text style={styles.featureText}>Self-custodied. Your keys, your crypto.</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="shield-checkmark" size={16} color="#6B6864" />
                      <Text style={styles.featureText}>Powered by the Stellar Network.</Text>
                    </View>
                  </View>
                </View>
              </ConditionalBlurView>

              {/* Footer Links */}
              <View style={styles.footer}>
                <Pressable>
                  <Text style={styles.footerLink}>New to crypto wallets?</Text>
                </Pressable>
                <Text style={styles.footerText}>We never store your private keys.</Text>
                <View style={styles.footerLinks}>
                  <Pressable>
                    <Text style={styles.footerLink}>Terms</Text>
                  </Pressable>
                  <Pressable>
                    <Text style={styles.footerLink}>Privacy</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Wallet Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ConditionalBlurView 
          intensity={30} 
          style={styles.modalOverlay} 
          tint="dark"
          fallbackStyle={styles.modalOverlayFallback}
        >
          <View style={styles.modalContent}>
            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <ConditionalBlurView 
                intensity={20} 
                style={styles.closeButtonBlur} 
                tint="light"
                fallbackStyle={styles.closeButtonFallback}
              >
                <Ionicons name="close" size={20} color="#33312E" />
              </ConditionalBlurView>
            </Pressable>

            {/* Modal Card */}
            <ConditionalBlurView 
              intensity={40} 
              style={styles.modalCard} 
              tint="light"
              fallbackStyle={styles.modalCardFallback}
            >
              <View style={styles.modalCardContent}>
                <Text style={styles.modalTitle}>Connect a Wallet</Text>

                {/* Input Section */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Enter your Stellar public address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={publicKey}
                    onChangeText={setPublicKey}
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    placeholderTextColor="#A0A0A0"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    multiline={false}
                    maxLength={56}
                  />
                  
                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.actionButtonPressed,
                      ]}
                      onPress={pasteFromClipboard}
                    >
                      <Text style={styles.actionButtonText}>📋 Paste</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.actionButtonPressed,
                      ]}
                      onPress={clearField}
                    >
                      <Text style={styles.actionButtonText}>🗑️ Clear</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* QR Scanner Option */}
                <Pressable
                  style={({ pressed }) => [
                    styles.qrScannerButton,
                    pressed && styles.qrScannerButtonPressed,
                  ]}
                  onPress={openQRScanner}
                >
                  <Ionicons name="qr-code-outline" size={24} color="#33312E" />
                  <Text style={styles.qrScannerButtonText}>Scan QR Code (Coming Soon)</Text>
                </Pressable>

                {/* Another Divider */}
                <View style={styles.divider} />

                {/* Connect Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.modalConnectButton,
                    pressed && styles.modalConnectButtonPressed,
                    (!publicKey.trim() || connecting) && styles.modalConnectButtonDisabled,
                  ]}
                  onPress={handleConnect}
                  disabled={!publicKey.trim() || connecting}
                >
                  <Text style={[
                    styles.modalConnectButtonText,
                    (!publicKey.trim() || connecting) && styles.modalConnectButtonTextDisabled,
                  ]}>
                    {connecting ? 'Connecting...' : 'Connect'}
                  </Text>
                </Pressable>

                {/* Success Message */}
                {connectionSuccess && (
                  <View style={styles.successMessage}>
                    <Ionicons name="checkmark-circle" size={24} color="#50E3C2" />
                    <Text style={styles.successText}>¡Conexión exitosa!</Text>
                    <Text style={styles.successSubtext}>Redirigiendo...</Text>
                  </View>
                )}

                {/* Instructions */}
                <View style={styles.instructions}>
                  <Text style={styles.instructionsTitle}>Where to find your address:</Text>
                  <Text style={styles.instructionsText}>
                    • Freighter: Click the copy icon{'\n'}
                    • LOBSTR: Settings → Account Details{'\n'}
                    • Rabet: Account → Copy Address{'\n'}
                    • Albedo: Your address appears on the main page
                  </Text>
                </View>
              </View>
            </ConditionalBlurView>
          </View>
        </ConditionalBlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4F0',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayFallback: {
    backgroundColor: 'rgba(249, 244, 240, 0.9)',
  },
  overlayColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(249, 244, 240, 0.8)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  mainCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
  },
  loginCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginCardFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#33312E',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B6864',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  connectButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  features: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#6B6864',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B6864',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#6B6864',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalOverlayFallback: {
    backgroundColor: 'rgba(51, 49, 46, 0.8)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  closeButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
  },
  modalCardFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  modalCardContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#33312E',
    textAlign: 'center',
    marginBottom: 24,
  },
  // New styles for input functionality
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 100, 0.3)',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#33312E',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    minHeight: 48,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 100, 0.3)',
  },
  actionButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#33312E',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(107, 104, 100, 0.3)',
    marginVertical: 16,
  },
  qrScannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 100, 0.3)',
    gap: 12,
    marginBottom: 16,
  },
  qrScannerButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  qrScannerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
  },
  modalConnectButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalConnectButtonPressed: {
    backgroundColor: '#357ABD',
  },
  modalConnectButtonDisabled: {
    backgroundColor: 'rgba(107, 104, 100, 0.3)',
  },
  modalConnectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modalConnectButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 104, 100, 0.3)',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#6B6864',
    lineHeight: 18,
  },
  successMessage: {
    alignItems: 'center',
    backgroundColor: 'rgba(80, 227, 194, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(80, 227, 194, 0.3)',
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#33312E',
  },
  successSubtext: {
    fontSize: 14,
    color: '#6B6864',
  },
});
