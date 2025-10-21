import React from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Product } from '../../../core/types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../../modules/ui';
import { theme } from '../../../core/theme';

interface ProductsGridProps {
  onProductPress: (product: Product) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ onProductPress }) => {
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const numColumns = Dimensions.get('window').width > theme.breakpoints.md ? 3 : 2;

  if (loading) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="loading"
          title="Cargando productos..."
          message="Estamos obteniendo los mejores productos para ti"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="wifi-off"
          title="Error de conexión"
          message="No pudimos cargar los productos. Revisa tu conexión e intenta de nuevo."
        />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="package-variant-closed"
          title="No hay productos disponibles"
          message="Estamos trabajando para traerte los mejores productos. ¡Vuelve pronto!"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      )}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
});