import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DataAnalysisLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto-redirect to credit score when 100% complete to show the new loan
          setTimeout(() => {
            router.replace({
              pathname: '/credit-score',
              params: { newApplication: 'true' }
            });
          }, 1500); // Wait 1.5 seconds after completion
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    router.replace({
      pathname: '/credit-score',
      params: { newApplication: 'true' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Kredi</Text>
        <Text style={styles.subtitle}>Decentralized Lending, Powered by Trust</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Analysis Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="analytics" size={50} color="#4A90E2" />
          </View>
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Analyzing Your Data</Text>
        <Text style={styles.description}>
          Your on-chain data is being analyzed to determine your credit score and loan eligibility.
        </Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Analysis in progress...</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {/* Time Estimate */}
        <View style={styles.timeEstimate}>
          <Ionicons name="time-outline" size={20} color="#6B6864" />
          <Text style={styles.timeText}>
            This process will take approximately 24 hours
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
            <Text style={styles.infoText}>Your data is encrypted and secure</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="notifications" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>We'll notify you when analysis is complete</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.infoText}>You can close the app safely</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.homeButton}
          onPress={handleGoHome}
        >
          <Text style={styles.homeButtonText}>View Credit Score</Text>
        </Pressable>
        
        <Text style={styles.footerText}>
          You will receive an email notification once the analysis is complete
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4F0',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 10,
    backgroundColor: '#F9F4F0',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#4A90E2',
    marginTop: 12,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '600',
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#33312E',
    fontWeight: '500',
    flex: 1,
  },
  bottomActions: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    gap: 16,
    backgroundColor: '#F9F4F0',
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 104, 100, 0.1)',
  },
  homeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    color: '#6B6864',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
