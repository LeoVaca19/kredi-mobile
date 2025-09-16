import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { APP_CONFIG } from '../config';
import { useWallet } from '../hooks/useWallet';
import krediAPI from '../services/krediAPI';
import { addLoanApplication } from '../store/slices/loansSlice';
import { validateLoanAmount, validatePurpose, validateRepaymentDays } from '../utils/helpers';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const LoanApplication = ({ navigation }) => {
  const { isConnected, wallet, accountExists, xlmBalance } = useWallet();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    repaymentDays: '7'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'Monto es requerido';
    } else if (!validateLoanAmount(amount, APP_CONFIG.MIN_LOAN_AMOUNT, APP_CONFIG.MAX_LOAN_AMOUNT)) {
      newErrors.amount = `Monto debe estar entre $${APP_CONFIG.MIN_LOAN_AMOUNT} y $${APP_CONFIG.MAX_LOAN_AMOUNT}`;
    }

    // Validate purpose
    if (!validatePurpose(formData.purpose)) {
      if (!formData.purpose.trim()) {
        newErrors.purpose = 'Propósito es requerido';
      } else if (formData.purpose.trim().length < 10) {
        newErrors.purpose = 'Propósito debe tener al menos 10 caracteres';
      } else if (formData.purpose.trim().length > 500) {
        newErrors.purpose = 'Propósito muy largo (máximo 500 caracteres)';
      }
    }

    // Validate repayment days
    if (!validateRepaymentDays(formData.repaymentDays)) {
      newErrors.repaymentDays = 'Plazo debe estar entre 1 y 30 días';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'Debes conectar tu wallet primero');
      return;
    }

    if (!accountExists) {
      Alert.alert('Error', 'Tu cuenta Stellar no existe o no tiene fondos');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const applicationData = {
        walletAddress: wallet.publicKey,
        loanAmount: parseFloat(formData.amount),
        purpose: formData.purpose.trim(),
        repaymentDays: parseInt(formData.repaymentDays)
      };

      const result = await krediAPI.applyForLoan(applicationData);

      if (result.success) {
        // Add to Redux store
        dispatch(addLoanApplication({
          id: result.data.applicationId,
          ...applicationData,
          status: result.data.status,
          appliedAt: new Date().toISOString(),
          ...result.data
        }));

        if (result.data.status === 'APPROVED') {
          Alert.alert(
            '¡Préstamo Aprobado! 🎉',
            result.data.message,
            [
              { 
                text: 'Ver Estado', 
                onPress: () => navigation?.navigate('LoanDashboard') 
              }
            ]
          );
          showSuccessToast('¡Préstamo aprobado!');
        } else if (result.data.status === 'REJECTED') {
          Alert.alert(
            'Préstamo Rechazado',
            result.data.message || 'Tu solicitud no fue aprobada',
            [{ text: 'OK' }]
          );
          showErrorToast('Préstamo rechazado');
        }

        // Reset form
        setFormData({
          amount: '',
          purpose: '',
          repaymentDays: '7'
        });
      } else {
        throw new Error(result.error || 'Error procesando solicitud');
      }
    } catch (error) {
      const errorMessage = krediAPI.getErrorMessage(error);
      Alert.alert('Error', errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.notConnectedContainer}>
        <Icon name="account-balance-wallet" size={64} color="#9CA3AF" />
        <Text style={styles.notConnectedTitle}>Wallet No Conectada</Text>
        <Text style={styles.notConnectedText}>
          Conecta tu wallet para solicitar un préstamo
        </Text>
      </View>
    );
  }

  if (!accountExists) {
    return (
      <View style={styles.notConnectedContainer}>
        <Icon name="error-outline" size={64} color="#F59E0B" />
        <Text style={styles.notConnectedTitle}>Cuenta No Encontrada</Text>
        <Text style={styles.notConnectedText}>
          Tu cuenta Stellar no existe o no tiene fondos suficientes
        </Text>
        <Text style={styles.balanceText}>
          Balance XLM: {xlmBalance.toFixed(2)}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Solicitar Préstamo</Text>
          <Text style={styles.subtitle}>
            Complete la información para procesar su solicitud
          </Text>
        </View>

        <View style={styles.form}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto del Préstamo</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                value={formData.amount}
                onChangeText={(value) => updateField('amount', value)}
                placeholder="100"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            <Text style={styles.helperText}>
              Monto entre ${APP_CONFIG.MIN_LOAN_AMOUNT} y ${APP_CONFIG.MAX_LOAN_AMOUNT}
            </Text>
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          {/* Purpose Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Propósito del Préstamo</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.purpose}
              onChangeText={(value) => updateField('purpose', value)}
              placeholder="Describe para qué necesitas el préstamo..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.helperText}>
              {formData.purpose.length}/500 caracteres (mínimo 10)
            </Text>
            {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}
          </View>

          {/* Repayment Days Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plazo de Pago (días)</Text>
            <View style={styles.daysContainer}>
              {[7, 15, 30].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    formData.repaymentDays === days.toString() && styles.dayButtonActive
                  ]}
                  onPress={() => updateField('repaymentDays', days.toString())}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.repaymentDays === days.toString() && styles.dayButtonTextActive
                  ]}>
                    {days} días
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.repaymentDays && <Text style={styles.errorText}>{errors.repaymentDays}</Text>}
          </View>

          {/* Account Info */}
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Información de la Cuenta</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountKey}>Wallet:</Text>
              <Text style={styles.accountValue}>
                {wallet?.publicKey?.slice(0, 6)}...{wallet?.publicKey?.slice(-6)}
              </Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountKey}>Balance XLM:</Text>
              <Text style={styles.accountValue}>{xlmBalance.toFixed(2)} XLM</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.submitButtonText}>Procesando...</Text>
              </>
            ) : (
              <>
                <Icon name="send" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Solicitar Préstamo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  scrollContainer: {
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  form: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    paddingLeft: 12
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
  },
  amountInput: {
    borderWidth: 0,
    fontSize: 18,
    fontWeight: '600'
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  dayButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6'
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151'
  },
  dayButtonTextActive: {
    color: '#FFFFFF'
  },
  accountInfo: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  accountKey: {
    fontSize: 14,
    color: '#6B7280'
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'monospace'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20
  },
  submitButtonDisabled: {
    opacity: 0.5
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  notConnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB'
  },
  notConnectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8
  },
  notConnectedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24
  },
  balanceText: {
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 8,
    fontFamily: 'monospace'
  }
});

export default LoanApplication;