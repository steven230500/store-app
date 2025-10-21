import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../store';
import { fetchProductsByCategory } from '../modules/products/redux/productsSlice';
import { Product, Category } from '../core/types';
import { theme } from '../core/theme';
import { AppIcon } from '../assets/icons';
import { formatCOP } from '../core/format';
import { ProductCard } from '../modules/ui/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

type Props = {
  category: Category;
  onProductPress: (p: Product) => void;
};

export const CategoryProductsScreen: React.FC<Props> = ({ category, onProductPress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { items: products, loading, error } = useSelector((s: RootState) => s.products);
  const { items: cartItems } = useSelector((s: RootState) => s.cart);

  useEffect(() => {
    dispatch(fetchProductsByCategory({ categoryId: category.id }));
  }, [dispatch, category.id]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcon name="arrowLeft" size={20} color={theme.colors.primary} />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{category.name}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
        >
          <AppIcon name="cart" size={24} color={theme.colors.primary} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Products Grid */}
        <View style={styles.grid}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={formatCOP(product.price_in_cents)}
              stock={product.stock}
              onPress={() => onProductPress(product)}
            />
          ))}
        </View>

        {/* Estados */}
        {loading && <ListState text="Cargando productos…" type="info" />}
        {!!error && <ListState text="Error al cargar productos" type="error" />}
        {!loading && !error && products.length === 0 && (
          <ListState text="No hay productos en esta categoría" type="info" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- UI helpers ---------- */

const ListState: React.FC<{ text: string; type: 'info' | 'error' }> = ({ text, type }) => (
  <View
    style={[
      styles.stateBox,
      type === 'error' ? { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' } : { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
    ]}
  >
    <Text style={[styles.stateText, type === 'error' && { color: '#991B1B' }]}>{text}</Text>
  </View>
);

/* ---------- styles ---------- */

const CARD_GAP = theme.spacing.md;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  cartButton: {
    padding: theme.spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  cartBadgeText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  grid: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    justifyContent: 'space-between',
  },

  stateBox: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
  },
  stateText: { color: theme.colors.text, fontWeight: theme.typography.fontWeight.medium },
});