import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, StatusBar, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../store';
import { CartSummary } from '../modules/cart';
import { CardForm } from '../modules/payment';
import { processCheckout } from '../modules/transactions';
import { clearCart } from '../modules/cart/redux/cartSlice';
import { Backdrop, Button, Card } from '../modules/ui';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CheckoutStep = 'cart' | 'card' | 'summary';

export const CheckoutScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { total_in_cents, items } = useSelector((state: RootState) => state.cart);
  const { card } = useSelector((state: RootState) => state.payment);
  const { loading } = useSelector((state: RootState) => state.transactions);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleCheckoutPress = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de continuar');
      return;
    }
    setCurrentStep('card');
    setShowBackdrop(true);
  };

  const handleBackdropClose = () => {
    setShowBackdrop(false);
    setCurrentStep('cart');
  };

  const handleCardSubmit = () => {
    setCurrentStep('summary');
  };

  const handleCardCancel = () => {
    setShowBackdrop(false);
    setCurrentStep('cart');
  };

  const handlePaymentConfirm = async () => {
    try {
      // Process checkout for each cart item
      for (const item of items) {
        await dispatch(processCheckout({
          productId: item.product_id,
          email: 'user@example.com', // TODO: Get from user data
          amountInCents: item.price_in_cents * item.qty,
          installments: 1,
          card: {
            number: '4111111111111111', // TODO: Get from payment form
            cvc: '123',
            exp_month: '12',
            exp_year: '25',
            card_holder: 'Test User',
          },
        })).unwrap();
      }

      // Clear cart on success
      dispatch(clearCart());

      // Success - navigate to status
      setShowBackdrop(false);
      navigation.navigate('Status' as never);
    } catch (error) {
      Alert.alert(
        'Error de pago',
        'Hubo un problema procesando el pago. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSummaryCancel = () => {
    setCurrentStep('card');
  };

  const renderBackdropContent = () => {
    switch (currentStep) {
      case 'card':
        return (
          <CardForm
            onSubmit={handleCardSubmit}
            onCancel={handleCardCancel}
          />
        );
      case 'summary':
        return (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <Icon name="credit-card-check-outline" size={48} color={theme.colors.primary} />
              <Text style={styles.summaryTitle}>Confirmar pago</Text>
              <Text style={styles.summarySubtitle}>Revisa los detalles antes de continuar</Text>
            </View>

            <Card variant="outlined" style={styles.summaryCard}>
              <View style={styles.summaryDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total a pagar:</Text>
                  <Text style={styles.detailValue}>{formatPrice(total_in_cents)}</Text>
                </View>

                {card.brand && card.last4 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tarjeta:</Text>
                    <View style={styles.cardInfo}>
                      <Icon
                        name={card.brand === 'VISA' ? 'credit-card' : 'credit-card-outline'}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.cardText}>
                        **** **** **** {card.last4}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Productos:</Text>
                  <Text style={styles.detailValue}>{items.length} artículo{items.length !== 1 ? 's' : ''}</Text>
                </View>
              </View>
            </Card>

            <View style={styles.summaryButtons}>
              <Button
                title="Cambiar tarjeta"
                variant="ghost"
                onPress={handleSummaryCancel}
                style={styles.cancelButton}
              />
              <Button
                title={loading ? 'Procesando...' : 'Confirmar pago'}
                variant="primary"
                onPress={handlePaymentConfirm}
                loading={loading}
                disabled={loading}
                style={styles.confirmButton}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <CartSummary onCheckoutPress={handleCheckoutPress} />
      </ScrollView>

      <Backdrop
        visible={showBackdrop}
        onClose={handleBackdropClose}
      >
        {renderBackdropContent()}
      </Backdrop>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    padding: theme.spacing.lg,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  summarySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: theme.spacing.xl,
  },
  summaryDetails: {
    gap: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  summaryButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
});