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
    View
} from 'react-native';

// LumenKit types and interfaces for React Native
interface ISupportedWallet {
  id: string;
  name: string;
  isAvailable: boolean;
  type: string;
  icon?: string;
  url?: string;
}

enum WalletNetwork {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  FUTURENET = 'futurenet'
}

// Simplified StellarWalletsKit for React Native
class StellarWalletsKit {
  private network: WalletNetwork;
  private selectedWalletId: string | null = null;
  private connectedAddress: string | null = null;

  constructor(config: { network: WalletNetwork; modules?: any[] }) {
    this.network = config.network;
  }

  async getSupportedWallets(): Promise<ISupportedWallet[]> {
    // Return supported wallets for React Native
    return [
      {
        id: 'freighter',
        name: 'Freighter',
        isAvailable: true,
        type: 'hot_wallet',
        icon: 'https://stellar.creit.tech/wallet-icons/freighter.png',
        url: 'https://freighter.app',
      },
      {
        id: 'lobstr',
        name: 'LOBSTR',
        isAvailable: true,
        type: 'hot_wallet',
        icon: 'https://stellar.creit.tech/wallet-icons/lobstr.png',
        url: 'https://lobstr.co',
      },
      {
        id: 'albedo',
        name: 'Albedo',
        isAvailable: true,
        type: 'hot_wallet',
        icon: 'https://stellar.creit.tech/wallet-icons/albedo.png',
        url: 'https://albedo.link',
      },
      {
        id: 'rabet',
        name: 'Rabet',
        isAvailable: true,
        type: 'hot_wallet',
        icon: 'https://stellar.creit.tech/wallet-icons/rabet.png',
        url: 'https://rabet.io',
      },
      {
        id: 'xbull',
        name: 'xBull',
        isAvailable: true,
        type: 'hot_wallet',
        icon: 'https://stellar.creit.tech/wallet-icons/xbull.png',
        url: 'https://xbull.app',
      },
      {
        id: 'walletconnect',
        name: 'WalletConnect',
        isAvailable: true,
        type: 'wallet_connect',
        icon: 'https://stellar.creit.tech/wallet-icons/walletconnect.png',
        url: 'https://walletconnect.com',
      },
    ];
  }

  setWallet(walletId: string): void {
    this.selectedWalletId = walletId;
  }

  async getAddress(): Promise<{ address: string }> {
    if (!this.selectedWalletId) {
      throw new Error('No wallet selected');
    }

    // For React Native, we'll simulate getting an address
    // In a real implementation, you would integrate with actual wallet SDKs
    const mockAddress = 'G' + 'A'.repeat(55); // Mock Stellar address
    this.connectedAddress = mockAddress;
    
    return { address: mockAddress };
  }

  async disconnect(): Promise<void> {
    this.selectedWalletId = null;
    this.connectedAddress = null;
  }

  async signTransaction(xdr: string): Promise<{ signedTxXdr: string }> {
    if (!this.selectedWalletId) {
      throw new Error('No wallet selected');
    }
    
    // Mock transaction signing
    return { signedTxXdr: xdr };
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    const passphrases = {
      [WalletNetwork.MAINNET]: 'Public Global Stellar Network ; September 2015',
      [WalletNetwork.TESTNET]: 'Test SDF Network ; September 2015',
      [WalletNetwork.FUTURENET]: 'Test SDF Future Network ; October 2022'
    };

    return {
      network: this.network,
      networkPassphrase: passphrases[this.network]
    };
  }
}

const { height } = Dimensions.get('window');

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
  const [stellarKit, setStellarKit] = useState<StellarWalletsKit | null>(null);
  const [supportedWallets, setSupportedWallets] = useState<ISupportedWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  // Initialize LumenKit with real wallet modules
  useEffect(() => {
    const initializeLumenKit = async () => {
      try {
        // Initialize StellarWalletsKit
        const kit = new StellarWalletsKit({
          network: WalletNetwork.TESTNET,
        });

        // Get supported wallets
        const wallets = await kit.getSupportedWallets();
        setSupportedWallets(wallets);
        setStellarKit(kit);

        console.log('LumenKit initialized successfully with wallets:', wallets);
      } catch (error) {
        console.error('Failed to initialize LumenKit:', error);
        Alert.alert('Error', 'Failed to initialize wallet connection. Using fallback mode.');
        
        // Fallback to basic wallet list if LumenKit fails
        const fallbackWallets: ISupportedWallet[] = [
          {
            id: 'freighter',
            name: 'Freighter',
            isAvailable: true,
            type: 'hot_wallet',
            icon: 'https://stellar.creit.tech/wallet-icons/freighter.png',
            url: 'https://freighter.app',
          },
          {
            id: 'lobstr',
            name: 'LOBSTR',
            isAvailable: true,
            type: 'hot_wallet',
            icon: 'https://stellar.creit.tech/wallet-icons/lobstr.png',
            url: 'https://lobstr.co',
          },
          {
            id: 'albedo',
            name: 'Albedo',
            isAvailable: true,
            type: 'hot_wallet',
            icon: 'https://stellar.creit.tech/wallet-icons/albedo.png',
            url: 'https://albedo.link',
          },
        ];
        setSupportedWallets(fallbackWallets);
      }
    };

    initializeLumenKit();
  }, []);

  const handleWalletConnect = async (walletId: string) => {
    if (!stellarKit) {
      Alert.alert('Error', 'Wallet kit not initialized. Please try again.');
      return;
    }

    setIsConnecting(true);
    try {
      const wallet = supportedWallets.find(w => w.id === walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      console.log(`Connecting to ${wallet.name}...`);
      
      // Use LumenKit to connect to the wallet
      stellarKit.setWallet(walletId);
      
      // Get wallet address
      const { address } = await stellarKit.getAddress();
      setConnectedAddress(address);
      
      console.log('Connected to wallet:', address);
      
      setModalVisible(false);
      // Navigate to main app after successful connection
      router.replace('/home');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = (error as any)?.code;
      
      if (errorCode === -3) {
        Alert.alert('Wallet Not Available', 'This wallet is not installed or not available on your device.');
      } else if (errorMessage.includes('User rejected')) {
        Alert.alert('Connection Cancelled', 'Wallet connection was cancelled by user.');
      } else {
        Alert.alert('Connection Failed', `Failed to connect to wallet: ${errorMessage}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (stellarKit) {
      try {
        await stellarKit.disconnect();
        setConnectedAddress(null);
        console.log('Wallet disconnected');
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  };

  const walletOptions = supportedWallets.map(wallet => ({
    name: wallet.name,
    id: wallet.id,
    isAvailable: wallet.isAvailable,
    onPress: () => handleWalletConnect(wallet.id),
  }));

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
                  <Text style={styles.cardTitle}>
                    {connectedAddress ? 'Connected to Kredi' : 'Connect to Kredi'}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {connectedAddress 
                      ? `Connected with: ${connectedAddress.slice(0, 8)}...${connectedAddress.slice(-8)}`
                      : 'Secure, self-custodied access to decentralized lending'
                    }
                  </Text>

                  {connectedAddress ? (
                    /* Disconnect Button */
                    <Pressable
                      style={({ pressed }) => [
                        styles.disconnectButton,
                        pressed && styles.disconnectButtonPressed,
                      ]}
                      onPress={handleDisconnect}
                    >
                      <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
                    </Pressable>
                  ) : (
                    /* Connect Wallet Button */
                    <Pressable
                      style={({ pressed }) => [
                        styles.connectButton,
                        pressed && styles.connectButtonPressed,
                        isConnecting && styles.connectButtonDisabled,
                      ]}
                      onPress={() => setModalVisible(true)}
                      disabled={isConnecting}
                    >
                      <LinearGradient
                        colors={isConnecting ? ['#ccc', '#ddd'] : ['#4A90E2', '#50E3C2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                      >
                        <Text style={styles.connectButtonText}>
                          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </Text>
                      </LinearGradient>
                    </Pressable>
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
                        !wallet.isAvailable && styles.walletButtonDisabled,
                        pressed && wallet.isAvailable && styles.walletButtonPressed,
                      ]}
                      onPress={() => {
                        if (wallet.isAvailable) {
                          wallet.onPress();
                        }
                      }}
                      disabled={!wallet.isAvailable || isConnecting}
                    >
                      <ConditionalBlurView 
                        intensity={20} 
                        style={[
                          styles.walletButtonBlur,
                          !wallet.isAvailable && styles.walletButtonBlurDisabled
                        ]} 
                        tint="light"
                        fallbackStyle={[
                          styles.walletButtonFallback,
                          !wallet.isAvailable && styles.walletButtonFallbackDisabled
                        ]}
                      >
                        <Text style={[
                          styles.walletButtonText,
                          !wallet.isAvailable && styles.walletButtonTextDisabled
                        ]}>
                          {wallet.name}
                        </Text>
                        {!wallet.isAvailable && (
                          <Text style={styles.walletUnavailableText}>Not Available</Text>
                        )}
                        {isConnecting && wallet.isAvailable && (
                          <Text style={styles.walletConnectingText}>Connecting...</Text>
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
  connectButtonDisabled: {
    opacity: 0.7,
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
  disconnectButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  disconnectButtonPressed: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  disconnectButtonText: {
    color: '#FF6B6B',
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
  walletButtonDisabled: {
    opacity: 0.5,
  },
  walletButtonBlurDisabled: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  walletButtonFallbackDisabled: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  walletButtonTextDisabled: {
    color: '#999',
  },
  walletUnavailableText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  walletConnectingText: {
    fontSize: 10,
    color: '#4A90E2',
    marginTop: 2,
    fontWeight: '600',
  },
});
