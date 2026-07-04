import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../common/Button';
import Card from '../common/Card';
import colors from '../../constants/colors';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Card style={styles.card}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title="Try Again" onPress={onRetry} variant="outline" style={{ minWidth: 160 }} />
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
  card: { alignItems: 'center', maxWidth: 400, width: '100%', paddingVertical: 40 },
  iconWrapper: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 24, fontWeight: '800', color: colors.error },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 16 },
});

export default ErrorState;
