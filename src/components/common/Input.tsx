import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, Platform } from 'react-native';
import colors from '../../constants/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style
        ]}
        placeholderTextColor={colors.placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          rest.onFocus && rest.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          rest.onBlur && rest.onBlur(e);
        }}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    } as any),
  },
  inputFocused: { 
    borderColor: colors.primary,
    ...(Platform.OS === 'web' && {
      boxShadow: `0 0 0 3px ${colors.primaryLight}40`,
    } as any),
  },
  inputError: { 
    borderColor: colors.error,
    ...(Platform.OS === 'web' && {
      boxShadow: `0 0 0 3px ${colors.errorLight}`,
    } as any),
  },
  error: { fontSize: 12, color: colors.error, marginTop: 6, fontWeight: '500' },
});

export default Input;
