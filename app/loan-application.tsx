import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

// Global type declaration for temporary data storage
declare global {
  var newLoanApplication: any;
}

export default function LoanApplicationScreen() {
  const { getUserData, isConnected } = useUser();
  const userData = getUserData();
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Credit limits and fees
  const MAX_CREDIT_LIMIT = 100;
  const STATIC_FEE = 2; // Static $2 fee
  const COLLATERAL_PERCENTAGE = 20; // 20%

  // Redirect to index if not connected
  if (!isConnected || !userData) {
    router.replace('/');
    return null;
  }

  // Calculate maximum date (1 month from now)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1);

  // Format date for calendar
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Calculate days from today to selected date
  const calculateDaysFromToday = (dateString: string) => {
    if (!dateString) return 0;
    const selectedDate = new Date(dateString);
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate fee amount (static $2)
  const calculateFee = (amount: number) => {
    return STATIC_FEE;
  };

  // Calculate collateral amount
  const calculateCollateral = (amount: number) => {
    return (amount * COLLATERAL_PERCENTAGE) / 100;
  };

  // Calculate upfront fee payment (just the $2 fee)
  const calculateUpfrontPayment = (amount: number) => {
    return calculateFee(amount); // Only the $2 fee
  };

  // Calculate total amount to pay back (full loan amount)
  const calculateTotalPayback = (amount: number) => {
    return amount; // User must pay back the full loan amount
  };

  // Calculate amount user receives (full loan amount)
  const calculateAmountReceived = (amount: number) => {
    return amount; // User receives the full $100
  };

  // Validate loan amount
  const validateLoanAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return false;
    if (numAmount <= 0) return false;
    if (numAmount > MAX_CREDIT_LIMIT) return false;
    return true;
  };

  // Handle preset payment periods
  const handlePresetPeriod = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + days);
    setSelectedDate(formatDate(targetDate));
  };

  const handleSubmit = async () => {
    if (!loanAmount || !purpose || !selectedDate || !dataConsent || !termsAccepted) {
      Alert.alert('Error', 'Please fill all fields and accept the required terms.');
      return;
    }

    // Validate loan amount
    if (!validateLoanAmount(loanAmount)) {
      Alert.alert('Error', `Loan amount must be between $1 and $${MAX_CREDIT_LIMIT}.`);
      return;
    }

    const daysToPayment = calculateDaysFromToday(selectedDate);
    const loanAmountNum = parseFloat(loanAmount);
    const feeAmount = calculateFee(loanAmountNum);
    const collateralAmount = calculateCollateral(loanAmountNum);
    const upfrontPayment = calculateUpfrontPayment(loanAmountNum);
    const totalPayback = calculateTotalPayback(loanAmountNum);
    const amountReceived = calculateAmountReceived(loanAmountNum);
    
    // Prepare loan application data
    const loanApplicationData = {
      id: Date.now().toString(), // Simple ID generation
      loanAmount: loanAmountNum,
      amountReceived,
      feeAmount,
      collateralAmount,
      upfrontPayment,
      totalPayback,
      staticFee: STATIC_FEE,
      collateralPercentage: COLLATERAL_PERCENTAGE,
      purpose,
      paymentDeadline: selectedDate,
      daysToPayment,
      dataAnalysisConsent: dataConsent,
      termsAccepted,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      // Include user wallet information
      userWallet: {
        publicKey: userData.publicKey,
        shortAddress: userData.shortAddress,
        connectionDate: userData.connectionDate,
      },
    };

    try {
      // TODO: Submit data to MongoDB
      await submitLoanApplicationToMongoDB(loanApplicationData);
      
      // Store the loan application data temporarily (in a real app, this would be in persistent storage)
      global.newLoanApplication = loanApplicationData;
      
      // If data consent is given, navigate to analysis loading screen
      if (dataConsent) {
        router.navigate('data-analysis-loading' as any);
      } else {
        // If no data consent, go directly to credit score screen
        router.push({
          pathname: '/credit-score',
          params: { newApplication: 'true' }
        });
      }
      
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
      console.error('Loan application submission error:', error);
    }
  };

  // TODO: Implement MongoDB integration
  const submitLoanApplicationToMongoDB = async (applicationData: any) => {
    // TODO: Replace with actual MongoDB integration
    /*
    const response = await fetch('YOUR_MONGODB_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN',
      },
      body: JSON.stringify({
        collection: 'loan_applications',
        data: applicationData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit to MongoDB');
    }

    return await response.json();
    */

    // Simulate API call for now
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Loan application data to be saved to MongoDB:', applicationData);
        resolve(applicationData);
      }, 1000);
    });
  };

  const handleTermsPress = () => {
    // TODO: You need to provide the URL for terms and conditions
    console.log('Navigate to terms and conditions');
    // router.push('/terms-and-conditions'); // Uncomment when URL is provided
  };

  const paymentPeriodOptions = [
    { label: '1 week', days: 7 },
    { label: '10 days', days: 10 },
    { label: '2 weeks', days: 14 },
    { label: '1 month', days: 30 },
  ];

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
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.brandTitle}>Kredi</Text>
          <Text style={styles.pageTitle}>Loan Application</Text>
          <Text style={styles.subtitle}>
            Please fill out the form below to apply for a loan.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Loan Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Amount (USD)</Text>
            <Text style={styles.helperText}>Maximum credit limit: ${MAX_CREDIT_LIMIT}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.textInput}
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="0.00"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            
            {/* Loan Calculation Summary */}
            {loanAmount && validateLoanAmount(loanAmount) && (
              <View style={styles.calculationSummary}>
                <Text style={styles.calculationTitle}>Loan Structure</Text>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Requested Amount:</Text>
                  <Text style={styles.calculationValue}>${parseFloat(loanAmount).toFixed(2)}</Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Processing Fee:</Text>
                  <Text style={styles.calculationValue}>${calculateFee(parseFloat(loanAmount)).toFixed(2)}</Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Collateral (Frozen):</Text>
                  <Text style={styles.calculationValue}>${calculateCollateral(parseFloat(loanAmount)).toFixed(2)}</Text>
                </View>
                <View style={[styles.calculationRow, styles.receivedRow]}>
                  <Text style={styles.receivedLabel}>You Receive:</Text>
                  <Text style={styles.receivedValue}>${calculateAmountReceived(parseFloat(loanAmount)).toFixed(2)}</Text>
                </View>
                <View style={[styles.calculationRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>You Must Repay:</Text>
                  <Text style={styles.totalValue}>${calculateTotalPayback(parseFloat(loanAmount)).toFixed(2)}</Text>
                </View>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>
                    💡 You receive the full amount and pay a one-time ${STATIC_FEE} processing fee. 
                    {COLLATERAL_PERCENTAGE}% collateral is frozen as security and returned when you repay.
                  </Text>
                </View>
              </View>
            )}
            
            {/* Error message for invalid amount */}
            {loanAmount && !validateLoanAmount(loanAmount) && (
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>
                  Amount must be between $1 and ${MAX_CREDIT_LIMIT}
                </Text>
              </View>
            )}
          </View>

          {/* Purpose of Loan */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purpose of Loan</Text>
            <TextInput
              style={[styles.textInput, styles.textInputFull]}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="e.g., Small Business, Education"
              placeholderTextColor="#A0A0A0"
              multiline={false}
            />
          </View>

          {/* Payment Deadline */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Day</Text>
            <Text style={styles.helperText}>Select your date to pay it in totality (within 1 month)</Text>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#4A90E2',
                    selectedTextColor: 'white'
                  }
                }}
                minDate={formatDate(today)}
                maxDate={formatDate(maxDate)}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#4A90E2',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#4A90E2',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: '#4A90E2',
                  disabledArrowColor: '#d9e1e8',
                  monthTextColor: '#4A90E2',
                  indicatorColor: '#4A90E2',
                  textDayFontWeight: '500',
                  textMonthFontWeight: '600',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14
                }}
              />
            </View>

            {/* Quick Selection Options */}
            <View style={styles.quickSelectionContainer}>
              <Text style={styles.quickSelectionLabel}>Quick Selection:</Text>
              <View style={styles.intervalContainer}>
                {paymentPeriodOptions.map((option) => (
                  <Pressable
                    key={option.days}
                    style={styles.intervalOption}
                    onPress={() => handlePresetPeriod(option.days)}
                  >
                    <Text style={styles.intervalOptionText}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Days Counter */}
            {selectedDate && (
              <View style={styles.daysCounterContainer}>
                <View style={styles.daysCounter}>
                  <Text style={styles.daysCounterText}>
                    Days to payment: {calculateDaysFromToday(selectedDate)} days
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
                </View>
              </View>
            )}
          </View>

          {/* Data Analysis Consent */}
          <View style={styles.checkboxGroup}>
            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setDataConsent(!dataConsent)}
            >
              <View style={[styles.checkbox, dataConsent && styles.checkboxChecked]}>
                {dataConsent && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxTitle}>Data Analysis Consent</Text>
                <Text style={styles.checkboxDescription}>
                  I agree to allow Kredi to analyze my on-chain data to determine my credit score and loan eligibility.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.checkboxGroup}>
            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxTitle}>Terms and Conditions</Text>
                <Text style={styles.checkboxDescription}>
                  I agree to the{' '}
                  <Text style={styles.linkText} onPress={handleTermsPress}>
                    terms and conditions
                  </Text>
                  {' '}of Kredi's lending platform.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              (!loanAmount || !purpose || !selectedDate || !dataConsent || !termsAccepted) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!loanAmount || !purpose || !selectedDate || !dataConsent || !termsAccepted}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </Pressable>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#33312E',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6864',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#6B6864',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B6864',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#33312E',
    fontWeight: '500',
  },
  textInputFull: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#33312E',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    padding: 10,
  },
  quickSelectionContainer: {
    marginTop: 16,
  },
  quickSelectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 8,
  },
  intervalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  intervalOption: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 80,
    alignItems: 'center',
  },
  intervalOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#33312E',
  },
  daysCounterContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  daysCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  daysCounterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  checkboxGroup: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#6B6864',
    lineHeight: 20,
  },
  linkText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  submitButton: {
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
  },
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '400',
  },
  calculationSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33312E',
    marginBottom: 12,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 14,
    color: '#6B6864',
    fontWeight: '500',
  },
  calculationValue: {
    fontSize: 14,
    color: '#33312E',
    fontWeight: '600',
  },
  receivedRow: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginBottom: 8,
  },
  receivedLabel: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '700',
  },
  receivedValue: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    color: '#33312E',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
    flex: 1,
  },
  noteContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  noteText: {
    fontSize: 12,
    color: '#6B6864',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});