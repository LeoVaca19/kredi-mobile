import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

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

export default function LoanHistoryScreen() {
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

  const calculateStats = () => {
    const completed = loanHistory.filter(loan => loan.status === 'completed');
    const totalAmount = completed.reduce((sum, loan) => sum + loan.amount, 0);
    const averageRate = completed.reduce((sum, loan) => sum + loan.interestRate, 0) / completed.length;
    
    return {
      totalLoans: completed.length,
      totalAmount,
      averageRate: averageRate.toFixed(1),
      onTimePayments: completed.length, // Assuming all completed were on time for demo
    };
  };

  const stats = calculateStats();

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
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </Pressable>
        <Text style={styles.headerTitle}>Loan History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalLoans}</Text>
              <Text style={styles.statLabel}>Total Loans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>${stats.totalAmount}</Text>
              <Text style={styles.statLabel}>Total Borrowed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.averageRate}%</Text>
              <Text style={styles.statLabel}>Avg. Interest</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.onTimePayments}</Text>
              <Text style={styles.statLabel}>On-Time Payments</Text>
            </View>
          </View>
        </View>

        {/* Loan History List */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>All Loans</Text>
          <FlatList
            data={loanHistory}
            renderItem={renderLoanItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
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
    paddingVertical: 20,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6864',
    fontWeight: '500',
    textAlign: 'center',
  },
  historyContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 16,
  },
  listContainer: {
    gap: 16,
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
});
