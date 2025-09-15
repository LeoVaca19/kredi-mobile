import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleApplyLoan = () => {
    console.log('Apply for loan pressed');
    router.push('/app-requirements');
  };

  const handleViewCreditScore = () => {
    console.log('View credit score pressed');
    router.push('/credit-score');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connected Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>connected: GURW....SDA</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Kredi</Text>
            <Text style={styles.subtitle}>Community-driven micro-lending.</Text>
          </View>

          {/* Action Cards */}
          <View style={styles.cardsContainer}>
            {/* Apply for Loan Card */}
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionCardPressed,
              ]}
              onPress={handleApplyLoan}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="card-outline" size={32} color="#4A90E2" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Apply for a Loan</Text>
                  <Text style={styles.cardDescription}>Access funds from the community.</Text>
                </View>
              </View>
            </Pressable>

            {/* View Credit Score Card */}
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionCardPressed,
              ]}
              onPress={handleViewCreditScore}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="analytics-outline" size={32} color="#4A90E2" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>View Credit Score</Text>
                  <Text style={styles.cardDescription}>Check your on-chain reputation.</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by the Stellar Network</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B6864',
    textAlign: 'center',
    fontWeight: '400',
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6B6864',
    fontWeight: '400',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 60,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#6B6864',
    fontWeight: '400',
  },
});