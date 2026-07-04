import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import colors from '../../constants/colors';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
  <View style={styles.container}>
    <Card style={styles.card}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>📭</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
  card: { alignItems: 'center', maxWidth: 400, width: '100%', paddingVertical: 40 },
  iconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  icon: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
});

export default EmptyState;
