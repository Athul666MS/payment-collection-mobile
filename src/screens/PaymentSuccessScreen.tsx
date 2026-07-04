import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import colors from '../constants/colors';
import { formatCurrency } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

const PaymentSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { receipt } = route.params;

  const rows = [
    { label: 'Transaction ID', value: receipt.transactionId, mono: true },
    { label: 'Customer', value: receipt.customerName },
    { label: 'Status', value: receipt.status, badge: true },
    { label: 'Amount Paid', value: `- ${formatCurrency(Number(receipt.paymentAmount))}`, deduction: true },
    { label: 'Previous Balance', value: formatCurrency(Number(receipt.previousBalance)) },
    { label: 'New Balance', value: formatCurrency(Number(receipt.newBalance)), highlight: true },
  ];

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>

        {/* Success Banner */}
        <View style={styles.banner}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.bannerTitle}>Payment Successful</Text>
          <Text style={styles.bannerAmount}>{formatCurrency(Number(receipt.paymentAmount))}</Text>
          <Text style={styles.bannerSub}>has been deducted from your balance</Text>
        </View>

        {/* Receipt Card */}
        <Card style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Transaction Details</Text>
          {rows.map((item, index) => (
            <View key={item.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              {item.badge ? (
                <View style={styles.badgeContainer}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>{item.value}</Text>
                </View>
              ) : (
                <Text style={[
                  styles.rowValue,
                  item.mono && styles.monoText,
                  item.deduction && styles.deductionText,
                  item.highlight && styles.highlightText,
                ]}
                  numberOfLines={1} ellipsizeMode="middle">{item.value}</Text>
              )}
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Back to Home" onPress={() => navigation.popToTop()} />
          <View style={{ height: 10 }} />
          <Button title="View Loan Details" onPress={() => navigation.navigate('LoanDetails', { accountNumber: receipt.accountNumber })} variant="outline" />
          <View style={{ height: 10 }} />
          <Button title="Payment History" onPress={() => navigation.navigate('PaymentHistory', { accountNumber: receipt.accountNumber })} variant="outline" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  container: { padding: 20, alignItems: 'center', maxWidth: 520, width: '100%', alignSelf: 'center' },

  // Banner
  banner: { alignItems: 'center', marginBottom: 24, marginTop: 16 },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  checkMark: { fontSize: 32, color: colors.white, fontWeight: '700' },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  bannerAmount: { fontSize: 32, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  bannerSub: { fontSize: 13, color: colors.textSecondary },

  // Receipt
  receiptCard: { width: '100%', marginBottom: 24 },
  receiptTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 13, color: colors.textSecondary },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, textAlign: 'right', maxWidth: '55%' },
  monoText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  deductionText: { color: colors.error, fontWeight: '700' },
  highlightText: { fontSize: 16, fontWeight: '800', color: colors.primary },

  // Status badge
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, gap: 6 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.success },

  // Actions
  actions: { width: '100%', maxWidth: 360 },
});

export default PaymentSuccessScreen;
