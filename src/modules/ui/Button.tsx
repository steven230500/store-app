import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { theme } from '../../core/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle: TextStyle[] = [styles.text];

    let sizeStyle: TextStyle;
    switch (size) {
      case 'sm':
        sizeStyle = styles.smText;
        break;
      case 'md':
        sizeStyle = styles.mdText;
        break;
      case 'lg':
        sizeStyle = styles.lgText;
        break;
      default:
        sizeStyle = styles.mdText;
    }
    baseTextStyle.push(sizeStyle);

    let variantStyle: TextStyle;
    switch (variant) {
      case 'primary':
        variantStyle = styles.primaryText;
        break;
      case 'secondary':
        variantStyle = styles.secondaryText;
        break;
      case 'outline':
        variantStyle = styles.outlineText;
        break;
      case 'ghost':
        variantStyle = styles.ghostText;
        break;
      default:
        variantStyle = styles.primaryText;
    }

    return [...baseTextStyle, variantStyle];
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.textInverse : theme.colors.primary}
        />
      ) : (
        <Text style={[...getTextStyle(), (disabled || loading) && styles.disabledText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },

  sm: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
  },
  md: {
    height: theme.components.button.height,
    paddingHorizontal: theme.spacing.lg,
  },
  lg: {
    height: 56,
    paddingHorizontal: theme.spacing.xl,
  },

  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
    ...theme.shadows.sm,
  },

  text: {
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.md,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },

  primaryText: {
    color: theme.colors.textInverse,
  },
  secondaryText: {
    color: theme.colors.textInverse,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
});