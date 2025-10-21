/* global console */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootState } from '../store';
import { clearCart } from '../modules/cart/redux/cartSlice';
import { clearTransaction } from '../modules/transactions/redux/transactionsSlice';
import { Button, Card } from '../modules/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSSE } from '../core/useSSE';
import SSEService from '../core/sseService';
import { RootStackParamList } from './AppNavigator';

export const StatusScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Status'>>();
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState<'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR'>('PENDING');

  const { current: transaction } = useSelector((state: RootState) => state.transactions);
  const transactionReference = route.params?.transactionReference || transaction?.reference;

  // Conectar SSE para actualizaciones en tiempo real
  const { disconnect } = useSSE(transactionReference || null, (status, updatedTransaction) => {
    console.log('StatusScreen - Estado actualizado:', status);
    setCurrentStatus(status as any);

    if (status === 'APPROVED') {
      dispatch(clearCart());
    }
  });

  useEffect(() => {
    if (!transaction && !transactionReference) {
      // If no transaction, go back to home
      navigation.navigate('Home' as never);
    } else if (transaction) {
      setCurrentStatus(transaction.status);
    }
  }, [transaction, transactionReference, navigation]);

  const handleContinueShopping = () => {
    if (currentStatus === 'APPROVED') {
      dispatch(clearCart());
    }
    dispatch(clearTransaction());
    // Desconectar SSE antes de navegar
    disconnect();
    navigation.navigate('Home' as never);
  };

  if (!transaction) {
    return null;
  }

  const isSuccess = currentStatus === 'APPROVED';
  const isError = currentStatus === 'DECLINED';
  const isPending = currentStatus === 'PENDING';

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon
            name={isSuccess ? 'check-circle' : isError ? 'close-circle' : 'clock-outline'}
            size={80}
            color={isSuccess ? '#28a745' : isError ? '#dc3545' : '#ffc107'}
          />
        </View>

        <Text style={styles.title}>
          {isSuccess ? '¡Pago exitoso!' : isError ? 'Pago rechazado' : isPending ? 'Procesando pago...' : 'Procesando...'}
        </Text>

        <Text style={styles.message}>
          {isSuccess
            ? 'Tu pedido ha sido procesado correctamente. Los productos han sido asignados.'
            : isError
            ? transaction?.error_message || 'Hubo un problema procesando tu pago.'
            : isPending
            ? 'Tu pago está siendo procesado. Espera un momento...'
            : 'Tu pago está siendo procesado.'
          }
        </Text>

        {transaction.id && (
          <Text style={styles.transactionId}>
            ID de transacción: {transaction.id}
          </Text>
        )}

        <Button
          title="Volver a productos"
          onPress={handleContinueShopping}
          style={styles.button}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  transactionId: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});