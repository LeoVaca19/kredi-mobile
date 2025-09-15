import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface LoanHistoryItem {
  id: string;
  amount: number;
  status: 'completed' | 'active' | 'overdue';
  purpose: string;
  startDate: string;
  endDate: string;
  daysToComplete: number;
  interestRate: number;
}

export default function CreditScoreScreen() {
  const [showAllLoans, setShowAllLoans] = useState(false);

  const userProfile = {
    name: 'Liam Carter',
    walletAddress: '0x123...456',
    avatar: '🐐', // Goat emoji representing the avatar
  };

  const creditScore = {
    score: 750,
    rating: 'Excellent',
    percentile: 85,
  };

  const loanHistory: LoanHistoryItem[] = [
    {
      id: '1',
      amount: 500,
      status: 'completed',
      purpose: 'Small Business',
      startDate: '2024-12-01',
      endDate: '2024-12-15',
      daysToComplete: 14,
      interestRate: 5.5,
    },
    {
      id: '2',
      amount: 300,
      status: 'completed',
      purpose: 'Education',
      startDate: '2024-11-10',
      endDate: '2024-11-20',
      daysToComplete: 10,
      interestRate: 4.2,
    },
    {
      id: '3',
      amount: 750,
      status: 'active',
      purpose: 'Emergency Fund',
      startDate: '2024-12-20',
      endDate: '2025-01-05',
      daysToComplete: 16,
      interestRate: 6.0,
    },
    {
      id: '4',
      amount: 200,
      status: 'completed',
      purpose: 'Equipment Purchase',
      startDate: '2024-10-15',
      endDate: '2024-10-22',
      daysToComplete: 7,
      interestRate: 3.8,
    },
    {
      id: '5',
      amount: 450,
      status: 'overdue',
      purpose: 'Medical Expenses',
      startDate: '2024-11-25',
      endDate: '2024-12-10',
      daysToComplete: 15,
      interestRate: 7.5,
    },
  ];

  // Get loans to display based on showAllLoans state
  const displayedLoans = showAllLoans ? loanHistory : loanHistory.slice(0, 1);

  const handleCopyHash = () => {
    const fullAddress = 'Gxyz123ABC456DEF789GHI012JKL345MNO678PQR901STU234VWX567YZ890'; // Example full address
    Clipboard.setString(fullAddress);
    Alert.alert('Copied!', 'Wallet address hash copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'active':
        return '#4A90E2';
      case 'overdue':
        return '#FF3B30';
      default:
        return '#6B6864';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'active':
        return 'time';
      case 'overdue':
        return 'warning';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Circle progress component
  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const progress = (score / 850) * 100; // Assuming max score is 850
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <Svg height={radius * 2} width={radius * 2}>
          {/* Background circle */}
          <Circle
            stroke="#E5E5E5"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <Circle
            stroke="#E67E22"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </Svg>
        <View style={styles.scoreTextContainer}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreLabel}>FICO Score</Text>
        </View>
      </View>
    );
  };

  const renderLoanItem = ({ item }: { item: LoanHistoryItem }) => (
    <View style={styles.loanCard}>
      <View style={styles.loanHeader}>
        <View style={styles.loanInfo}>
          <Text style={styles.loanAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.loanPurpose}>{item.purpose}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.loanDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.daysToComplete} days</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interest Rate:</Text>
          <Text style={styles.detailValue}>{item.interestRate}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Period:</Text>
          <Text style={styles.detailValue}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Credit Score</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{userProfile.avatar}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.walletAddress}>{userProfile.walletAddress}</Text>
          </View>
        </View>

        {/* Credit Score Section */}
        <View style={styles.creditScoreSection}>
          <View style={styles.scoreHeader}>
            <Text style={styles.sectionTitle}>Credit Score</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{creditScore.rating}</Text>
            </View>
          </View>

          {/* Circular Progress */}
          <View style={styles.scoreContainer}>
            <CircularProgress score={creditScore.score} />
          </View>

          <Text style={styles.percentileText}>
            Your score is better than {creditScore.percentile}% of users.
          </Text>

          {/* Copy Hash Button */}
          <Pressable style={styles.copyButton} onPress={handleCopyHash}>
            <Ionicons name="copy-outline" size={20} color="#33312E" />
            <Text style={styles.copyButtonText}>Copy Hash</Text>
          </Pressable>
        </View>

        {/* Loan History */}
        <View style={styles.loanHistorySection}>
          <View style={styles.loanHistoryHeader}>
            <Text style={styles.sectionTitle}>Loan History</Text>
            {!showAllLoans && loanHistory.length > 1 && (
              <Pressable onPress={() => setShowAllLoans(true)}>
                <Text style={styles.viewMoreText}>View More</Text>
              </Pressable>
            )}
          </View>
          <FlatList
            data={displayedLoans}
            renderItem={renderLoanItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.loanHistoryList}
          />
          {showAllLoans && (
            <Pressable 
              style={styles.viewLessButton}
              onPress={() => setShowAllLoans(false)}
            >
              <Text style={styles.viewLessText}>View Less</Text>
              <Ionicons name="chevron-up" size={16} color="#4A90E2" />
            </Pressable>
          )}
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 16,
    color: '#B8860B',
    fontWeight: '500',
  },
  creditScoreSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
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
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#33312E',
  },
  ratingBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#33312E',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '500',
    marginTop: 4,
  },
  percentileText: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
    marginBottom: 25,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
  },
  loanHistorySection: {
    marginBottom: 30,
  },
  loanHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  loanHistoryList: {
    gap: 16,
    marginTop: 20,
  },
  loanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loanInfo: {
    flex: 1,
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 4,
  },
  loanPurpose: {
    fontSize: 16,
    color: '#6B6864',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loanDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#33312E',
    fontWeight: '600',
  },
  viewLessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    gap: 8,
  },
  viewLessText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});