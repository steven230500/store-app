import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../core/theme';
import { AppIcon } from '../../assets/icons';

type Props = {
  name: string;
  price: string;   // ya formateado
  stock: number;
  onPress?: () => void;
  fixedHeight?: boolean; // Nueva prop para controlar altura fija
};

export const ProductCard: React.FC<Props> = ({ name, price, stock, onPress, fixedHeight = false }) => {
  return (
    <TouchableOpacity style={[styles.card, fixedHeight && styles.fixedHeight]} onPress={onPress} activeOpacity={0.9}>
      {/* placeholder de imagen */}
      <View style={styles.image}>
        <AppIcon name="package" size={28} color={theme.colors.primary} />
      </View>

      {/* texto */}
      <Text numberOfLines={2} style={styles.name}>{name}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>{price}</Text>
        <View style={styles.stockPill}>
          <View style={styles.dot} />
          <Text style={styles.stockText}>{stock} disp.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CARD_WIDTH = (theme.dimensions.screenWidth - theme.spacing.lg * 2 - theme.spacing.md) / 2;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    minHeight: 240, // Altura mínima para contener todo el contenido
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.md,
    justifyContent: 'space-between', // Distribuye el contenido
  },
  fixedHeight: {
    height: 240, // Altura fija para el home
    marginBottom: theme.spacing.md, // Espacio adicional abajo
    marginRight: theme.spacing.md, // Separación horizontal entre cards
  },
  image: {
    height: 110,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    minHeight: 40,
    flex: 1, // Permite que el texto ocupe espacio disponible
  },
  footer: {
    marginTop: 'auto', // Empuja el footer hacia abajo
    gap: theme.spacing.xs,
  },
  price: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  stockPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.success },
  stockText: { color: theme.colors.success, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold },
});
