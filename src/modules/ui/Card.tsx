import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../core/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof theme.spacing;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
  onPress,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  const getCardStyle = () => {
    const baseStyle = [
      styles.card,
      styles[variant],
      { padding: theme.spacing[padding] },
    ];

    if (onPress) {
      baseStyle.push(styles.pressable);
    }

    return baseStyle;
  };

  return (
    <CardComponent
      style={[...getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.components.card.borderRadius,
    margin: theme.components.card.margin,
  },

  default: {
    ...theme.shadows.md,
  },

  elevated: {
    ...theme.shadows.lg,
  },

  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },

  pressable: {
    ...theme.shadows.sm,
  },
});