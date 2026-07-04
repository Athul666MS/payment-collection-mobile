import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.background },
  spinnerWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
});

export default Loader;
