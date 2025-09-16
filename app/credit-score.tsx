import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Clipboard,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

// Global type declaration for temporary data storage
declare global {
  var newLoanApplication: any;
}

interface LoanHistoryItem {
  id: string;
  amount: number;
  status: 'completed' | 'active' | 'overdue' | 'pending';
  purpose: string;
  startDate: string;
  endDate: string;
  daysToComplete: number;
  interestRate: number;
}

export default function CreditScoreScreen() {
  const { getUserData, isConnected } = useUser();
  const userData = getUserData();
  const params = useLocalSearchParams();
  const [showAllLoans, setShowAllLoans] = useState(false);
  const [loanHistory, setLoanHistory] = useState<LoanHistoryItem[]>([]);

  // Redirect to index if not connected
  if (!isConnected || !userData) {
    router.replace('/');
    return null;
  }

  const userProfile = {
    name: 'Mr. Kredi',
    walletAddress: userData.shortAddress,
    publicKey: userData.publicKey,
    avatar: '🐐', // Goat emoji representing the avatar
  };

  const creditScore = {
    score: 0,
    rating: 'New Account',
    percentile: 0,
  };

  // Initialize loan history - start with empty array for new accounts
  useEffect(() => {
    const initialLoans: LoanHistoryItem[] = []; // Start with no loans for new account

    // Check if there's a new loan application
    if (params.newApplication === 'true' && global.newLoanApplication) {
      const newLoan: LoanHistoryItem = {
        id: global.newLoanApplication.id,
        amount: global.newLoanApplication.loanAmount,
        status: 'pending',
        purpose: global.newLoanApplication.purpose,
        startDate: global.newLoanApplication.submittedAt,
        endDate: global.newLoanApplication.paymentDeadline,
        daysToComplete: global.newLoanApplication.daysToPayment,
        interestRate: 6.0, // Default interest rate for new applications
      };
      
      // Add new loan to the beginning of the array
      setLoanHistory([newLoan, ...initialLoans]);
      
      // Clear the global variable to prevent duplicates
      global.newLoanApplication = null;
    } else {
      setLoanHistory(initialLoans);
    }
  }, [params.newApplication]);

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
      case 'pending':
        return '#FF9500';
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
      case 'pending':
        return 'hourglass';
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

  // Speedometer gauge component
  const SpeedometerGauge = ({ score }: { score: number }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayScore, setDisplayScore] = useState(0);
    
    const size = 180;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Score ranges and colors (matching the reference image)
    const ranges = [
      { min: 300, max: 379, color: '#8B0000', label: 'Ultra Low' },      // Dark red
      { min: 380, max: 459, color: '#DC143C', label: 'Very Low' },       // Red
      { min: 460, max: 539, color: '#FF4500', label: 'Low' },            // Orange-red
      { min: 540, max: 619, color: '#FF8C00', label: 'Moderate' },       // Orange
      { min: 620, max: 699, color: '#FFD700', label: 'High' },           // Gold/Yellow
      { min: 700, max: 779, color: '#ADFF2F', label: 'Very High' },      // Green-yellow
      { min: 780, max: 850, color: '#32CD32', label: 'Ultra High' }      // Green
    ];
    
    // Calculate angle for needle (180 degrees semicircle)
    const minScore = 300;
    const maxScore = 850;
    const normalizedScore = Math.max(minScore, Math.min(maxScore, score === 0 ? 300 : score)); // If score is 0, show at minimum position
    const scorePercent = (normalizedScore - minScore) / (maxScore - minScore);
    const needleAngle = scorePercent * 180 - 90; // -90 to start from left
    
    // Get current score color - special handling for score 0
    const getCurrentRange = (currentScore: number) => {
      if (currentScore === 0) {
        return { min: 0, max: 0, color: '#8B0000', label: 'New Account' }; // Use ultra low color for score 0
      }
      return ranges.find(range => currentScore >= range.min && currentScore <= range.max) || ranges[0];
    };
    
    const currentRange = getCurrentRange(score);
    
    // Animation effect
    useEffect(() => {
      const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      });
      
      const listener = animatedValue.addListener(({ value }) => {
        const currentScore = Math.round(value * score);
        setDisplayScore(currentScore);
      });
      
      animation.start();
      
      return () => {
        animatedValue.removeListener(listener);
      };
    }, [score]);
    
    // Create gauge segments
    const createGaugeSegments = () => {
      const segments: React.ReactElement[] = [];
      const totalAngle = 180; // Complete semicircle
      const segmentAngle = totalAngle / ranges.length;
      
      ranges.forEach((range, index) => {
        const startAngle = -90 + (index * segmentAngle); // Start from left (-90°)
        const endAngle = startAngle + segmentAngle;
        
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;
        
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
        
        segments.push(
          <Path
            key={index}
            d={pathData}
            stroke={range.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        );
      });
      
      return segments;
    };
    
    // Create animated needle - special handling for score 0
    const animatedNeedleAngle = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-90, score === 0 ? -90 : needleAngle], // Keep needle at start for score 0
    });
    
    return (
      <View style={styles.speedometerContainer}>
        <Svg width={size} height={size * 0.7}>
          <G>
            {/* Gauge segments */}
            {createGaugeSegments()}
            
            {/* Score markers */}
            {[300, 380, 460, 540, 620, 700, 780, 850].map((markerScore) => {
              const markerPercent = (markerScore - minScore) / (maxScore - minScore);
              const markerAngle = markerPercent * 180 - 90; // -90 to start from left
              const markerAngleRad = (markerAngle * Math.PI) / 180;
              
              const innerRadius = radius - strokeWidth / 2 - 8;
              const outerRadius = radius - strokeWidth / 2 + 8;
              
              const x1 = centerX + innerRadius * Math.cos(markerAngleRad);
              const y1 = centerY + innerRadius * Math.sin(markerAngleRad);
              const x2 = centerX + outerRadius * Math.cos(markerAngleRad);
              const y2 = centerY + outerRadius * Math.sin(markerAngleRad);
              
              return (
                <Line
                  key={markerScore}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#333"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Needle */}
            <Animated.View
              style={{
                position: 'absolute',
                left: centerX - 1,
                top: centerY - radius + strokeWidth,
                width: 2,
                height: radius - strokeWidth / 2,
                backgroundColor: '#333',
                transformOrigin: '50% 100%',
                transform: [
                  {
                    rotate: animatedNeedleAngle.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            />
            
            {/* Center dot */}
            <Circle
              cx={centerX}
              cy={centerY}
              r="4"
              fill="#333"
            />
          </G>
        </Svg>
        
        <View style={styles.scoreDisplayContainer}>
          <Text style={styles.scoreTitle}>This wallet's Credit Score is:</Text>
          <Text style={[styles.scoreNumber, { color: currentRange.color }]}>
            {displayScore}
          </Text>
          <Text style={styles.scoreRating}>{currentRange.label}</Text>
        </View>
      </View>
    );
  };

  const renderLoanItem = ({ item }: { item: LoanHistoryItem }) => (
    <View style={styles.loanCard}>
      <View style={styles.loanHeader}>
        <View style={styles.loanInfo}>
          <Text style={styles.loanAmount}>${(item.amount || 0).toFixed(2)}</Text>
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

          {/* Speedometer Gauge */}
          <View style={styles.scoreContainer}>
            <SpeedometerGauge score={creditScore.score} />
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
          
          {loanHistory.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="document-text-outline" size={48} color="#4A90E2" />
              </View>
              <Text style={styles.emptyStateTitle}>You don't have any loans in your history</Text>
              <Text style={styles.emptyStateSubtitle}>
                Start by applying for your first loan to build your credit history and unlock better rates.
              </Text>
              <Pressable 
                style={styles.applyLoanButton}
                onPress={() => router.push('/app-requirements')}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.applyLoanButtonText}>Apply for Loan</Text>
              </Pressable>
            </View>
          ) : (
            <>
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
            </>
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
    color: '#4A90E2',
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
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  speedometerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  scoreDisplayContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  scoreTitle: {
    fontSize: 18,
    color: '#6B6864',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreRating: {
    fontSize: 16,
    color: '#6B6864',
    fontWeight: '500',
    marginTop: 4,
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
    color: '#4A90E2',
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginTop: 20,
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
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#33312E',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B6864',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  applyLoanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyLoanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});