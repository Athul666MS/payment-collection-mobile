import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { PaymentHistory as PaymentHistoryType } from '../types';
import { getPaymentHistory } from '../api/endpoints';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorState from '../components/feedback/ErrorState';
import EmptyState from '../components/feedback/EmptyState';
import colors from '../constants/colors';
import { formatCurrency, formatDateTime } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

const PaymentHistoryScreen: React.FC<Props> = ({ route }) => {
  const { accountNumber } = route.params;
  const [payments, setPayments] = useState<PaymentHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError(null);
      const data = await getPaymentHistory(accountNumber);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accountNumber]);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );
  const onRefresh = () => { setRefreshing(true); fetchHistory(); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return colors.success;
      case 'FAILED': return colors.error;
      case 'PENDING': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: PaymentHistoryType }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <Card style={styles.paymentCard}>
        <View style={styles.paymentTop}>
          <View style={styles.paymentLeft}>
            <Text style={styles.amount}>{formatCurrency(Number(item.payment_amount))}</Text>
            <Text style={styles.dateText}>{formatDateTime(item.payment_date)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusColor + '15' }]}>
            <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.txRow}>
          <Text style={styles.txLabel}>ID</Text>
          <Text style={styles.txValue} numberOfLines={1} ellipsizeMode="middle">{item.transaction_id}</Text>
        </View>
      </Card>
    );
  };

  if (loading) return <Loader message="Loading payment history..." />;
  if (error) return <ErrorState message={error} onRetry={fetchHistory} />;
  if (payments.length === 0) return <EmptyState title="No Payments Yet" message="No payment history found for this account. Make your first payment to see it here." />;

  return (
    <View style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={styles.countChip}>
            <Text style={styles.countText}>{payments.length}</Text>
          </View>
        </View>
        <FlatList data={payments} keyExtractor={(item) => item.transaction_id} renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, maxWidth: 640, width: '100%', alignSelf: 'center' },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  countChip: { backgroundColor: colors.primary + '15', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  countText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  list: { paddingHorizontal: 20, paddingBottom: 20 },

  // Card
  paymentCard: { paddingVertical: 16 },
  paymentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  paymentLeft: {},
  amount: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  dateText: { fontSize: 12, color: colors.textMuted },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, gap: 6 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Transaction ID
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  txLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  txValue: { fontSize: 12, color: colors.textSecondary, flex: 1 },
});

export default PaymentHistoryScreen;
