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

export default function LoanApplicationScreen() {
  const { getUserData, isConnected } = useUser();
  const userData = getUserData();
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

    const daysToPayment = calculateDaysFromToday(selectedDate);
    
    // Prepare loan application data
    const loanApplicationData = {
      amount: parseFloat(loanAmount),
      purpose,
      paymentDeadline: selectedDate,
      daysToPayment,
      dataAnalysisConsent: dataConsent,
      termsAccepted,
      submittedAt: new Date().toISOString(),
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
      
      // If data consent is given, navigate to analysis loading screen
      if (dataConsent) {
        router.navigate('data-analysis-loading' as any);
      } else {
        // If no data consent, show simple success message
        Alert.alert(
          'Application Submitted',
          `Your loan application has been submitted successfully!\nPayment deadline: ${selectedDate}\nDays to pay: ${daysToPayment} days`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
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
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.textInput}
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="0.00"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
              />
            </View>
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
});