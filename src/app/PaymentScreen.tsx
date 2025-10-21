/* global console */
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../store';
import { RootStackParamList } from './AppNavigator';
import { CardForm } from '../modules/payment';
import { processCheckout } from '../modules/transactions';
import { clearCart } from '../modules/cart/redux/cartSlice';
import { Button } from '../modules/ui';
import { theme } from '../core/theme';

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const { total_in_cents, items } = useSelector((state: RootState) => state.cart);
  const { card } = useSelector((state: RootState) => state.payment);
  const { loading } = useSelector((state: RootState) => state.transactions);

  console.log('PaymentScreen renderizado', { total_in_cents, itemsLength: items.length });

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleCardSubmit = useCallback(async () => {
    console.log('Procesando pago...');
    try {
      let transactionReference = null;

      // Process checkout for each cart item
      for (const item of items) {
        console.log('Procesando item:', item.product_id);
        const result = await dispatch(processCheckout({
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

        console.log('Resultado del pago:', result);

        // Store transaction reference for SSE
        if (result.reference) {
          transactionReference = result.reference;
        }

        // Check payment status from response
        if (result.status === 'APPROVED') {
          console.log('Pago aprobado para item:', item.product_id);
        } else if (result.status === 'DECLINED') {
          console.log('Pago rechazado para item:', item.product_id);
          throw new Error('Pago rechazado por el banco');
        } else if (result.status === 'ERROR') {
          console.log('Error procesando pago para item:', item.product_id);
          throw new Error('Error procesando el pago');
        } else if (result.status === 'PENDING') {
          console.log('Pago pendiente para item:', item.product_id, '- esperando confirmación');
          // For PENDING status, we could implement polling here if needed
          // For now, we'll treat it as successful since the transaction was created
        }
      }

      console.log('Pago exitoso, limpiando carrito');
      // Clear cart on success
      dispatch(clearCart());

      console.log('Navegando a pantalla de estado con reference:', transactionReference);
      // Success - navigate to status with transaction reference
      navigation.navigate('Status', { transactionReference: transactionReference || undefined });
    } catch (error) {
      console.log('Error en pago:', error);
      Alert.alert(
        'Error de pago',
        error instanceof Error ? error.message : 'Hubo un problema procesando el pago. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  }, [dispatch, items, navigation]);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pago seguro</Text>
        <Text style={styles.subtitle}>Ingresa los datos de tu tarjeta</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total a pagar: {formatPrice(total_in_cents)}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <CardForm
          onSubmit={handleCardSubmit}
          onCancel={handleCancel}
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
    padding: theme.spacing.lg,
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
  summary: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  summaryText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  formContainer: {
    flex: 1,
  },
});