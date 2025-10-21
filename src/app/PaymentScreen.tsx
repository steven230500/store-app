import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../store';
import { RootStackParamList } from './AppNavigator';
import { CardForm } from '../modules/payment';
import { processCheckout } from '../modules/transactions';
import { clearCart } from '../modules/cart/redux/cartSlice';
import { theme } from '../core/theme';

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const { total_in_cents, items } = useSelector((state: RootState) => state.cart);
  const { card } = useSelector((state: RootState) => state.payment);


  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleCardSubmit = useCallback(async () => {
    console.log('Iniciando proceso de pago');
    console.log('Estado actual de card en Redux:', card);
    try {
      let transactionReference = null;
      console.log(`Procesando ${items.length} items del carrito`);

      for (const item of items) {
        console.log(`Procesando item: ${item.product_id}, cantidad: ${item.qty}, precio: ${item.price_in_cents}`);
        const checkoutData = {
          productId: item.product_id,
          email: card.email || 'user@example.com',
          amountInCents: item.price_in_cents * item.qty,
          installments: 1,
          card: {
            number: card.number || '',
            cvc: card.cvc || '',
            exp_month: card.exp_month || '',
            exp_year: card.exp_year || '',
            card_holder: card.card_holder || '',
          },
        };
        console.log('Datos enviados al checkout:', checkoutData);

        const result = await dispatch(processCheckout(checkoutData)).unwrap();

        console.log(`Resultado del procesamiento para item ${item.product_id}:`, result);

        if (result.reference) {
          transactionReference = result.reference;
          console.log(`Referencia de transacción obtenida: ${transactionReference}`);
        }

        if (result.status === 'DECLINED') {
          console.log('Pago rechazado por el banco');
          throw new Error('Pago rechazado por el banco');
        } else if (result.status === 'ERROR') {
          console.log('Error procesando el pago');
          throw new Error('Error procesando el pago');
        } else if (result.status === 'APPROVED') {
          console.log('Pago aprobado exitosamente');
        }
      }

      console.log('Pago procesado exitosamente, limpiando carrito');
      dispatch(clearCart());
      navigation.navigate('Status', { transactionReference: transactionReference || undefined });
    } catch (error) {
      console.error('Error en handleCardSubmit:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Detalles del error de Axios:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
        });
      }
      Alert.alert(
        'Error de pago',
        error instanceof Error ? error.message : 'Hubo un problema procesando el pago. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  }, [dispatch, items, navigation, card]);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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