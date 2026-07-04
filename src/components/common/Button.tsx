import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Platform,
} from 'react-native';
import colors from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  style?: ViewStyle | ViewStyle[];
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'danger':
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  const getHoverStyle = () => {
    if (!isHovered || isDisabled || Platform.OS !== 'web') return null;
    switch (variant) {
      case 'primary':
        return styles.primaryHover;
      case 'secondary':
        return styles.secondaryHover;
      case 'outline':
        return styles.outlineHover;
      case 'danger':
        return styles.dangerHover;
      default:
        return styles.primaryHover;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        getButtonStyle(),
        getHoverStyle(),
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      // @ts-ignore
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} size="small" />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    } as any),
  },
  primary: { backgroundColor: colors.primary },
  primaryHover: { backgroundColor: colors.primaryHover },
  secondary: { backgroundColor: colors.textSecondary },
  secondaryHover: { backgroundColor: colors.textPrimary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  outlineHover: { backgroundColor: colors.primaryLight + '20' },
  danger: { backgroundColor: colors.danger },
  dangerHover: { backgroundColor: colors.error },
  disabled: { opacity: 0.6, cursor: 'not-allowed' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  text: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  primaryText: { color: colors.white },
  outlineText: { color: colors.primary },
});

export default Button;
