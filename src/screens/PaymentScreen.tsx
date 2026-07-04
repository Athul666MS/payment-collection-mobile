import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../navigation/types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import colors from '../constants/colors';
import { makePayment } from '../api/endpoints';
import { formatCurrency } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const getPaymentSchema = (maxAmount: number) => z.object({
  amount: z.string().min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), 'Amount must be a valid number')
    .refine((val) => Number(val) > 0, 'Amount must be greater than zero')
    .refine((val) => Number(val) <= maxAmount, `Amount cannot exceed remaining balance (₹${maxAmount})`),
});
type PaymentForm = z.infer<ReturnType<typeof getPaymentSchema>>;

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { accountNumber, emiDue, remainingBalance } = route.params;
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false); // Prevent double-click

  const { control, handleSubmit, formState: { errors } } = useForm<PaymentForm>({
    resolver: zodResolver(getPaymentSchema(remainingBalance)),
    defaultValues: { amount: emiDue ? String(emiDue) : '' },
  });

  const onSubmit = async (data: PaymentForm) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);
    try {
      const receipt = await makePayment(accountNumber, Number(data.amount));
      navigation.replace('PaymentSuccess', { receipt });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Payment Failed', text2: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
      setTimeout(() => { isSubmitting.current = false; }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          {/* Account Info Bar */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Account</Text>
                <Text style={styles.infoValue}>{accountNumber}</Text>
              </View>
              <View style={styles.infoSeparator} />
              <View>
                <Text style={styles.infoLabel}>Balance</Text>
                <Text style={styles.infoValue}>{formatCurrency(remainingBalance)}</Text>
              </View>
              <View style={styles.infoSeparator} />
              <View>
                <Text style={styles.infoLabel}>EMI Due</Text>
                <Text style={[styles.infoValue, { color: colors.primary }]}>{formatCurrency(emiDue)}</Text>
              </View>
            </View>
          </Card>

          {/* Payment Form */}
          <Card>
            <Text style={styles.formTitle}>Payment Amount</Text>
            <Text style={styles.formDesc}>Enter the amount you'd like to pay towards your loan.</Text>

            <Controller control={control} name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Amount (₹)" placeholder="Enter amount" value={value}
                  onChangeText={onChange} onBlur={onBlur} error={errors.amount?.message}
                  keyboardType="numeric" returnKeyType="done" />
              )}
            />

            <View style={styles.noteBar}>
              <Text style={styles.noteText}>Payment must be between ₹1 and {formatCurrency(remainingBalance)}</Text>
            </View>

            <Button title={loading ? 'Processing...' : 'Confirm Payment'} onPress={handleSubmit(onSubmit)} loading={loading} disabled={loading} />
          </Card>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  container: { padding: 20, maxWidth: 520, width: '100%', alignSelf: 'center' },

  // Info Card
  infoCard: { marginBottom: 0 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  infoSeparator: { width: 1, height: 36, backgroundColor: colors.border },

  // Form
  formTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  formDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  noteBar: { backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  noteText: { fontSize: 13, color: colors.textSecondary },
});

export default PaymentScreen;
