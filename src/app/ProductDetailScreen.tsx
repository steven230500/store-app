/* global setTimeout, clearTimeout */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addItem } from '../modules/cart/redux/cartSlice';
import { Product } from '../core/types';
import { Button, Card, Toast } from '../modules/ui';
import { theme } from '../core/theme';
import { AppIcon } from '../assets/icons';
import { RootStackParamList } from './AppNavigator';
import { RootState } from '../store';

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const { items: cartItems } = useSelector((s: RootState) => s.cart);
  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    dispatch(addItem({
      product: {
        product_id: product.id,
        name: product.name,
        price_in_cents: product.price_in_cents,
        qty: quantity,
        image_url: product.image_url,
      },
      qty: quantity
    }));

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowToast(false);
      setIsAddingToCart(false);
    }, 2000);

    setShowToast(true);
  }, [dispatch, product, quantity, isAddingToCart, bounceAnim]);

  const adjustQuantity = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return theme.colors.error;
    if (stock <= 5) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header con carrito */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcon name="checkCircle" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del producto</Text>
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

      {/* Toast personalizado */}
      <Toast
        visible={showToast}
        message={`${product.name} x${quantity} agregado al carrito`}
        type="success"
        duration={2000}
        onHide={() => setShowToast(false)}
        action={{
          label: 'Ver carrito',
          onPress: () => {
            setShowToast(false);
            navigation.navigate('Cart');
          },
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Botón de volver arriba */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonTop}
        >
          <AppIcon name="checkCircle" size={20} color={theme.colors.primary} />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.imageContainer}>
            {product.image_url ? (
              <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.placeholder}>
                <AppIcon name="imageOff" size={80} color={theme.colors.textMuted} />
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.productHeader}>
              <Text style={styles.name}>{product.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(product.price_in_cents)}</Text>
                <Text style={styles.currency}>COP</Text>
              </View>
            </View>

            <View style={styles.stockContainer}>
              <AppIcon
                name={product.stock > 0 ? 'package' : 'package'}
                size={16}
                color={getStockColor(product.stock)}
              />
              <Text style={[styles.stock, { color: getStockColor(product.stock) }]}>
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Producto agotado'}
              </Text>
            </View>

            {product.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>
            )}

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Seleccionar cantidad</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => adjustQuantity(-1)}
                  style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonDisabled]}
                  disabled={quantity <= 1}
                >
                  <AppIcon
                    name="minus"
                    size={20}
                    color={quantity <= 1 ? theme.colors.textMuted : theme.colors.primary}
                  />
                </TouchableOpacity>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustQuantity(1)}
                  style={[styles.qtyButton, quantity >= product.stock && styles.qtyButtonDisabled]}
                  disabled={quantity >= product.stock}
                >
                  <AppIcon
                    name="plus"
                    size={20}
                    color={quantity >= product.stock ? theme.colors.textMuted : theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.totalContainer}>
             <Text style={styles.totalLabel}>Total:</Text>
             <Text style={styles.totalPrice}>
               {formatPrice(product.price_in_cents * quantity)}
             </Text>
           </View>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isAddingToCart ? "Agregando..." : "Agregar al carrito"}
          onPress={handleAddToCart}
          variant="primary"
          size="lg"
          style={styles.addButton}
          disabled={product.stock === 0 || isAddingToCart}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
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
  scrollView: {
    flex: 1,
  },
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.xxxl,
  },
  imageContainer: {
    height: 280,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  productHeader: {
    marginBottom: theme.spacing.lg,
  },
  name: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.xxxl,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: theme.typography.fontSize.huge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  currency: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  stock: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.xl,
  },
  descriptionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  quantitySection: {
    marginBottom: theme.spacing.xl,
  },
  quantityLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qtyButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  qtyButtonDisabled: {
    backgroundColor: theme.colors.surfaceDark,
    borderColor: theme.colors.borderLight,
  },
  quantityDisplay: {
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.surface,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  totalPrice: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  addButton: {
    width: '100%',
  },
});