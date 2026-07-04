import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, StatusBar, useWindowDimensions
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../navigation/types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import colors from '../constants/colors';
import { getCustomerByAccount } from '../api/endpoints';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

const searchSchema = z.object({
  accountNumber: z.string().trim().min(1, 'Account number is required'),
});
type SearchForm = z.infer<typeof searchSchema>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { accountNumber: '' },
  });

  const onSearch = async (data: SearchForm) => {
    setLoading(true);
    try {
      await getCustomerByAccount(data.accountNumber.trim());
      navigation.navigate('LoanDetails', { accountNumber: data.accountNumber.trim() });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Customer not found.' });
    } finally {
      setLoading(false);
    }
  };

  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleMakePayment = async () => {
    const acc = control._formValues.accountNumber?.trim();
    if (!acc) {
      Toast.show({ type: 'info', text1: 'Account Required', text2: 'Please enter an account number first.' });
      return;
    }
    setPaymentLoading(true);
    try {
      const customer = await getCustomerByAccount(acc);
      navigation.navigate('Payment', { 
        accountNumber: acc, 
        emiDue: Number(customer.emi_due), 
        remainingBalance: Number(customer.remaining_balance) 
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Customer not found.' });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewHistory = () => {
    const acc = control._formValues.accountNumber?.trim();
    if (!acc) {
      Toast.show({ type: 'info', text1: 'Account Required', text2: 'Please enter an account number first.' });
      return;
    }
    navigation.navigate('PaymentHistory', { accountNumber: acc });
  };

  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Payment Collection</Text>
            </View>
            <Text style={styles.heroTitle}>Manage your loan{'\n'}payments with ease</Text>
            <Text style={styles.heroSubtitle}>
              Search for an account to view loan details, make payments, or track your payment history.
            </Text>
          </View>

          {/* Search Card */}
          <Card style={styles.searchCard}>
            <Text style={styles.searchTitle}>Look up account</Text>
            <Text style={styles.searchDesc}>Enter the customer account number to get started.</Text>
            <Controller
              control={control}
              name="accountNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Account Number"
                  placeholder="e.g. ACC1001"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.accountNumber?.message}
                  autoCapitalize="characters"
                  returnKeyType="search"
                  onSubmitEditing={handleSubmit(onSearch)}
                />
              )}
            />
            <Button title="View Loan Details" onPress={handleSubmit(onSearch)} loading={loading} />
          </Card>

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionDesc}>Shortcuts for common tasks</Text>
          </View>
          <View style={[styles.actions, isWide && styles.actionsRow]}>
            <Card
              style={[styles.actionCardInner, isWide ? { flex: 1 } : { width: '100%' }]}
              onPress={handleMakePayment}
              disabled={paymentLoading}
            >
              <View style={[styles.actionIconWrapper, { backgroundColor: colors.primary + '12' }]}>  
                <Text style={styles.actionIcon}>{paymentLoading ? '⏳' : '💳'}</Text>
              </View>
              <View style={styles.actionTextGroup}>
                <Text style={styles.actionTitle}>{paymentLoading ? 'Loading...' : 'Make Payment'}</Text>
                <Text style={styles.actionDesc}>Pay your monthly EMI quickly and securely</Text>
              </View>
            </Card>
            <Card
              style={[styles.actionCardInner, isWide ? { flex: 1 } : { width: '100%' }]}
              onPress={handleViewHistory}
            >
              <View style={[styles.actionIconWrapper, { backgroundColor: colors.success + '12' }]}>
                <Text style={styles.actionIcon}>📊</Text>
              </View>
              <View style={styles.actionTextGroup}>
                <Text style={styles.actionTitle}>View History</Text>
                <Text style={styles.actionDesc}>Track all past transactions and receipts</Text>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  container: { padding: 20, paddingBottom: 40, maxWidth: 640, width: '100%', alignSelf: 'center' },

  // Hero
  hero: { marginBottom: 32, marginTop: 24 },
  heroBadge: { backgroundColor: colors.primary + '12', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 16 },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, lineHeight: 36, marginBottom: 12 },
  heroSubtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },

  // Search
  searchCard: { marginBottom: 32 },
  searchTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  searchDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },

  // Section
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  sectionDesc: { fontSize: 13, color: colors.textMuted },

  // Actions
  actions: { gap: 12 },
  actionsRow: { flexDirection: 'row' },
  actionCardInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionIconWrapper: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 22 },
  actionTextGroup: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  actionDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});

export default HomeScreen;
