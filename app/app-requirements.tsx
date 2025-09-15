import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AppRequirementsScreen() {
  const requirements = [
    {
      icon: 'checkmark-circle' as const,
      title: 'Verified identity and unique account.',
      completed: true,
    },
    {
      icon: 'time' as const,
      title: 'Minimum 3 months of active and diversified app usage history.',
      completed: false,
    },
    {
      icon: 'card' as const,
      title: 'Verifiable income within the app that allows covering the fee.',
      completed: false,
    },
    {
      icon: 'trending-up' as const,
      title: 'Small initial loan, with possibility to grow based on good behavior.',
      completed: false,
    },
    {
      icon: 'lock-closed' as const,
      title: 'Real commitment, either with locked savings or collateral.',
      completed: false,
    },
    {
      icon: 'shield-checkmark' as const,
      title: 'Healthy behavior, no returns or suspicious transactions.',
      completed: false,
    },
  ];

  const handleContinue = () => {
    router.push('/loan-application');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#33312E" />
        </Pressable>
        <Text style={styles.headerTitle}>App Requirements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            This is what you need to get started with Kredi. Make sure you meet all the requirements below.
          </Text>
        </View>

        {/* Requirements List */}
        <View style={styles.requirementsContainer}>
          {requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={[
                styles.iconContainer,
                requirement.completed && styles.iconContainerCompleted
              ]}>
                <Ionicons 
                  name={requirement.icon} 
                  size={24} 
                  color={requirement.completed ? '#34C759' : '#4A90E2'} 
                />
              </View>
              <Text style={styles.requirementText}>{requirement.title}</Text>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Got it</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#33312E',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  requirementsContainer: {
    marginBottom: 40,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  iconContainerCompleted: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  requirementText: {
    flex: 1,
    fontSize: 16,
    color: '#33312E',
    lineHeight: 24,
    fontWeight: '400',
    paddingTop: 8,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 10,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
