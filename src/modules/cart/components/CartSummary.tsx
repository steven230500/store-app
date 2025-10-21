import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from '../../../store';
import { RootStackParamList } from '../../../app/AppNavigator';
import { removeItem, setQty } from '../redux/cartSlice';
import { Button, Card } from '../../../modules/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartSummaryProps {
  onCheckoutPress: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckoutPress }) => {
  const { items, total_in_cents } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleQtyChange = (product_id: string, newQty: number) => {
    if (newQty <= 0) {
      dispatch(removeItem(product_id));
    } else {
      dispatch(setQty({ product_id, qty: newQty }));
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <Button title="Seguir comprando" onPress={() => navigation.navigate('Home')} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Carrito</Text>
        <Text style={styles.headerSubtitle}>{items.length} producto{items.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product_id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemImage}>
                {item.image_url ? (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>IMG</Text>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>IMG</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price_in_cents)} c/u
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <View style={styles.qtyControls}>
                    <Button
                      title="-"
                      onPress={() => handleQtyChange(item.product_id, item.qty - 1)}
                      style={styles.qtyButton}
                      textStyle={styles.qtyButtonText}
                    />
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <Button
                      title="+"
                      onPress={() => handleQtyChange(item.product_id, item.qty + 1)}
                      style={styles.qtyButton}
                      textStyle={styles.qtyButtonText}
                    />
                  </View>

                  <Text style={styles.itemTotal}>
                    {formatPrice(item.price_in_cents * item.qty)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>{formatPrice(total_in_cents)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValue}>Gratis</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>{formatPrice(total_in_cents)}</Text>
              </View>
            </View>

            <Button
              title="Pagar"
              onPress={() => {
                console.log('Navegando a Payment screen');
                navigation.navigate('Payment');
              }}
              style={styles.checkoutButton}
              size="lg"
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 16,
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemImage: {
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemInfo: {
    flex: 1,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6c757d',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 32,
    height: 32,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
    color: '#212529',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 0,
  },
});