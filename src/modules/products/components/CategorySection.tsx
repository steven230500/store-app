import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Product } from '../../../core/types';
import { ProductCard } from '../../../modules/ui/ProductCard';
import { theme } from '../../../core/theme';

interface CategorySectionProps {
  title: string;
  products: Product[];
  onProductPress: (product: Product) => void;
  onSeeAllPress?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  products,
  onProductPress,
  onSeeAllPress,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products.slice(0, 6)} // Show max 6 products per category
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={`$${(item.price_in_cents / 100).toFixed(2)}`}
            stock={item.stock}
            onPress={() => onProductPress(item)}
            fixedHeight={true}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  list: {
    paddingLeft: theme.spacing.lg,
  },
});