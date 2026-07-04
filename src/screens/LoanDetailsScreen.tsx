import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Customer } from '../types';
import { getCustomerByAccount } from '../api/endpoints';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorState from '../components/feedback/ErrorState';
import colors from '../constants/colors';
import { formatCurrency, formatDate } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'LoanDetails'>;

const LoanDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { accountNumber } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    try {
      setError(null);
      const data = await getCustomerByAccount(accountNumber);
      setCustomer(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accountNumber]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomer();
    }, [fetchCustomer])
  );

  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  const onRefresh = () => { setRefreshing(true); fetchCustomer(); };

  if (loading) return <Loader message="Loading loan details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchCustomer} />;
  if (!customer) return <ErrorState message="Customer not found." onRetry={fetchCustomer} />;

  const isPaid = customer.current_emi_status === 'PAID';

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}>
      <View style={styles.container}>

        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customer.customer_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.customerName}>{customer.customer_name}</Text>
              <Text style={styles.accountNum}>{customer.account_number}</Text>
            </View>
          </View>
        </Card>

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Remaining Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(Number(customer.remaining_balance))}</Text>
          <View style={styles.emiRow}>
            <View style={styles.emiItem}>
              <Text style={styles.emiItemLabel}>EMI Due</Text>
              <Text style={styles.emiItemValue}>{formatCurrency(Number(customer.emi_due))}</Text>
            </View>
            <View style={[styles.statusChip, { backgroundColor: isPaid ? colors.successLight : colors.warningLight }]}>
              <View style={[styles.statusDot, { backgroundColor: isPaid ? colors.success : colors.warning }]} />
              <Text style={[styles.statusText, { color: isPaid ? colors.success : colors.warning }]}>
                {isPaid ? 'PAID' : 'PENDING'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Summary Grid */}
        <View style={[styles.summaryGrid, isWide && styles.summaryGridWide]}>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Interest Rate</Text>
            <Text style={styles.summaryValue}>{customer.interest_rate}%</Text>
          </Card>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tenure</Text>
            <Text style={styles.summaryValue}>{customer.tenure} mo</Text>
          </Card>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Issue Date</Text>
            <Text style={styles.summaryValue}>{formatDate(customer.issue_date)}</Text>
          </Card>
        </View>

        {/* Last Payment */}
        {customer.last_transaction_id && (
          <Card>
            <Text style={styles.sectionTitle}>Last Payment</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>{formatCurrency(Number(customer.last_payment_amount))}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(customer.last_payment_date!)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValueSmall} numberOfLines={1} ellipsizeMode="middle">{customer.last_transaction_id}</Text>
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button title="Make Payment" onPress={() => navigation.navigate('Payment', { accountNumber, emiDue: Number(customer.emi_due), remainingBalance: Number(customer.remaining_balance) })} />
          <View style={{ height: 10 }} />
          <Button title="Payment History" onPress={() => navigation.navigate('PaymentHistory', { accountNumber })} variant="outline" />
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  container: { padding: 20, maxWidth: 640, width: '100%', alignSelf: 'center' },

  // Profile
  profileCard: { marginBottom: 0 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.white },
  profileInfo: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  accountNum: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  // Balance
  balanceCard: { backgroundColor: colors.primary, borderColor: colors.primary },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontWeight: '500' },
  balanceAmount: { fontSize: 32, fontWeight: '800', color: colors.white, marginBottom: 16 },
  emiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, marginTop: 4 },
  emiItem: {},
  emiItemLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginBottom: 2 },
  emiItemValue: { fontSize: 16, fontWeight: '700', color: colors.white },
  statusChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // Summary Grid
  summaryGrid: { gap: 12 },
  summaryGridWide: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginBottom: 6 },
  summaryValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },

  // Details
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  divider: { height: 1, backgroundColor: colors.border },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  detailValueSmall: { fontSize: 12, fontWeight: '500', color: colors.textSecondary, maxWidth: '50%' },

  // Actions
  actionsContainer: { marginTop: 8, maxWidth: 400, width: '100%', alignSelf: 'center' },
});

export default LoanDetailsScreen;
