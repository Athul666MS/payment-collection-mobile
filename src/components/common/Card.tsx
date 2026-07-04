import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Platform, Pressable } from 'react-native';
import colors from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, onPress, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = [
    styles.card,
    isHovered && onPress && !disabled && Platform.OS === 'web' ? styles.cardHovered : null,
    style
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        // @ts-ignore
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={({ pressed }) => [
          cardStyle,
          pressed && !disabled && styles.cardPressed,
          disabled && styles.cardDisabled
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease-in-out',
    } as any),
  },
  cardHovered: {
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    transform: [{ translateY: -2 }],
    borderColor: colors.primaryLight,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.5,
  }
});

export default Card;
