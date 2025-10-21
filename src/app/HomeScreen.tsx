import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, fetchCategories, searchProducts } from '../modules/products/redux/productsSlice';
import { Product } from '../core/types';
import { theme } from '../core/theme';
import { AppIcon } from '../assets/icons';

import { CategorySection } from '../modules/products/components/CategorySection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

type Props = { onProductPress: (p: Product) => void };

export const HomeScreen: React.FC<Props> = ({ onProductPress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { items: products, categories, loading, error } = useSelector((s: RootState) => s.products);
  const { items: cartItems } = useSelector((s: RootState) => s.cart);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
    } else {
      dispatch(fetchProducts());
    }
  }, [searchQuery, dispatch]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heroTitle}>Tienda</Text>
            <Text style={styles.heroSubtitle}>Descubre nuestros productos</Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
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

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar productos…"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {categories.slice(0, 3).map(cat => {
          const inCat = products.slice(0, 6);
          return (
            <CategorySection
              key={cat.id}
              title={cat.name}
              products={inCat}
              onProductPress={onProductPress}
              onSeeAllPress={() => {
                navigation.navigate('CategoryProducts', { category: cat });
              }}
            />
          );
        })}

        {loading && <ListState text="Cargando productos…" type="info" />}
        {!!error && <ListState text="Error al cargar productos" type="error" />}
      </ScrollView>
    </SafeAreaView>
  );
};


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



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  cartButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
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


  searchContainer: {
    margin: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  search: {
    marginTop: theme.spacing.md,
    height: 50,
    backgroundColor: theme.colors.card,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    color: theme.colors.text,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
