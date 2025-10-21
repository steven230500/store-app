// src/assets/icons/index.ts
import React from 'react';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const icons = {
  imageOff: 'image-off',
  creditCard: 'credit-card-outline',
  cart: 'cart',
  checkCircle: 'check-circle',
  closeCircle: 'close-circle',
  clock: 'clock-outline',
  alert: 'alert-circle',
  package: 'package-variant-closed',
  arrowLeft: 'arrow-left',
  plus: 'plus',
  minus: 'minus',
} as const;

export type IconKey = keyof typeof icons;

type AppIconProps = {
  name: IconKey;
  size?: number;
  color?: string;
};

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 22, color = '#333' }) => {
  return React.createElement(MCIcon, { name: icons[name], size, color });
};