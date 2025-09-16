// Import polyfills first
import '../polyfills';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Stellar Wallet imports using Lumenkit - Simple approach
import {
  AlbedoModule,
  FreighterModule,
  LobstrModule,
  RabetModule,
  StellarWalletsKit,
  WalletNetwork,
  xBullModule
} from '@lumenkit/stellar-wallets/build';

const { width, height } = Dimensions.get('window');

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
  const [modalVisible, setModalVisible] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);

  useEffect(() => {
    // Initialize Stellar Wallets Kit
    initializeKit();
  }, []);

  useEffect(() => {
    // Check if wallet is already connected when kit is ready
    if (kit) {
      checkWalletConnection();
    }
  }, [kit]);

  const initializeKit = () => {
    try {
      const stellarKit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET, // Change to WalletNetwork.PUBLIC for production
        modules: [
          new FreighterModule(),
          new AlbedoModule(),
          new LobstrModule(),
          new RabetModule(),
          new xBullModule()
        ]
      });
      setKit(stellarKit);
    } catch (error) {
      console.error('Error initializing Stellar Wallets Kit:', error);
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (kit) {
        // Check if there's already a connected wallet
        const result = await kit.getAddress();
        if (result && result.address) {
          setPublicKey(result.address);
          setConnectedWallet('connected');
        }
      }
    } catch (error) {
      console.log('No wallet connected:', error);
    }
  };

  const handleWalletConnect = async (walletId: string) => {
    if (!kit) return;
    
    setIsConnecting(true);
    try {
      // Set the wallet and get address
      kit.setWallet(walletId);
      const result = await kit.getAddress();
      
      if (result && result.address) {
        setPublicKey(result.address);
        setConnectedWallet(walletId);
        setModalVisible(false);
        
        Alert.alert(
          'Wallet Connected!', 
          `Successfully connected ${walletId}\nPublic Key: ${result.address.substring(0, 10)}...`,
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/home'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      Alert.alert(
        'Connection Failed',
        'Failed to connect to wallet. Please make sure the wallet is installed and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWalletModal = async () => {
    if (!kit) return;
    
    try {
      // Simply show our custom modal
      setModalVisible(true);
    } catch (error) {
      console.error('Error opening wallet modal:', error);
      // Fallback to custom modal
      setModalVisible(true);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (kit) {
        await kit.disconnect();
      }
      setPublicKey(null);
      setConnectedWallet(null);
      Alert.alert('Disconnected', 'Wallet has been disconnected successfully.');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const walletOptions = [
    { 
      name: 'Freighter', 
      id: 'freighter',
      onPress: () => handleWalletConnect('freighter') 
    },
    { 
      name: 'Albedo', 
      id: 'albedo',
      onPress: () => handleWalletConnect('albedo') 
    },
    { 
      name: 'LOBSTR', 
      id: 'lobstr',
      onPress: () => handleWalletConnect('lobstr') 
    },
    { 
      name: 'Rabet', 
      id: 'rabet',
      onPress: () => handleWalletConnect('rabet') 
    },
    { 
      name: 'xBull', 
      id: 'xbull',
      onPress: () => handleWalletConnect('xbull') 
    },
  ];

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
                    onPress={() => {
                      if (connectedWallet) {
                        // If already connected, go to home
                        router.replace('/home');
                      } else {
                        // Use the kit modal if available, otherwise show custom modal
                        if (kit) {
                          handleWalletModal();
                        } else {
                          setModalVisible(true);
                        }
                      }
                    }}
                  >
                    <LinearGradient
                      colors={connectedWallet ? ['#4CAF50', '#45A049'] : ['#4A90E2', '#50E3C2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradient}
                    >
                      <Text style={styles.connectButtonText}>
                        {connectedWallet ? 'Continue to App' : 'Connect Wallet'}
                      </Text>
                    </LinearGradient>
                  </Pressable>

                  {/* Connection Status */}
                  {connectedWallet && publicKey && (
                    <View style={styles.connectionStatus}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.connectionStatusText}>
                        Connected: {publicKey.substring(0, 8)}...{publicKey.substring(-4)}
                      </Text>
                    </View>
                  )}

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

                {/* Wallet Options Grid */}
                <View style={styles.walletGrid}>
                  {walletOptions.map((wallet, index) => (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.walletButton,
                        pressed && styles.walletButtonPressed,
                        isConnecting && styles.walletButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!isConnecting) {
                          wallet.onPress();
                        }
                      }}
                      disabled={isConnecting}
                    >
                      <ConditionalBlurView 
                        intensity={20} 
                        style={styles.walletButtonBlur} 
                        tint="light"
                        fallbackStyle={styles.walletButtonFallback}
                      >
                        <Text style={[
                          styles.walletButtonText,
                          isConnecting && styles.walletButtonTextDisabled
                        ]}>
                          {wallet.name}
                        </Text>
                        {isConnecting && (
                          <Text style={styles.connectingText}>Connecting...</Text>
                        )}
                      </ConditionalBlurView>
                    </Pressable>
                  ))}
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Create New Wallet Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.createWalletButton,
                    pressed && styles.createWalletButtonPressed,
                  ]}
                  onPress={() => {
                    console.log('Create new wallet');
                    setModalVisible(false);
                    // Navigate to main app after creating wallet
                    router.replace('/home');
                  }}
                >
                  <Text style={styles.createWalletButtonText}>Create New Wallet</Text>
                </Pressable>
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
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  walletButton: {
    flex: 1,
    minWidth: '45%',
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  walletButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  walletButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  walletButtonFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  walletButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33312E',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginVertical: 16,
  },
  createWalletButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  createWalletButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  createWalletButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#33312E',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  connectionStatusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  walletButtonDisabled: {
    opacity: 0.6,
  },
  walletButtonTextDisabled: {
    opacity: 0.6,
  },
  connectingText: {
    fontSize: 10,
    color: '#6B6864',
    marginTop: 2,
  },
});
