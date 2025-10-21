import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../../core/types';
import { Card } from '../../../modules/ui';
import { theme } from '../../../core/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const formatPrice = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(dollars);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return theme.colors.error;
    if (stock <= 5) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
      <Card variant="elevated" padding="md" style={styles.card}>
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Icon name="package-variant" size={40} color={theme.colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price_in_cents)}</Text>
            <Text style={styles.currency}>COP</Text>
          </View>

          <View style={styles.stockContainer}>
            <Icon
              name={product.stock > 0 ? 'package-variant' : 'package-variant-closed'}
              size={14}
              color={getStockColor(product.stock)}
            />
            <Text style={[styles.stock, { color: getStockColor(product.stock) }]}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const numColumns = screenWidth > theme.breakpoints.md ? 3 : 2;
const cardWidth = (screenWidth - theme.spacing.xl * 2 - theme.spacing.md * (numColumns - 1)) / numColumns;

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    margin: theme.spacing.xs,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  currency: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stock: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
});