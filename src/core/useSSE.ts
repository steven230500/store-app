/* global console */
import { useEffect, useRef } from 'react';
import SSEService from './sseService';

export const useSSE = (transactionId: string | null, onStatusUpdate?: (status: string, transaction: any) => void) => {
  const sseRef = useRef<any>(null);

  useEffect(() => {
    if (!transactionId) return;

    const handleMessage = (data: any) => {
      console.log('SSE Message:', data);

      switch (data.type) {
        case 'initial':
          console.log('📡 SSE - Estado inicial recibido:', {
            status: data.transaction?.status,
            transactionId: data.transaction?.id,
            reference: data.transaction?.reference,
            amount: data.transaction?.amountInCents,
            timestamp: data.timestamp
          });
          if (onStatusUpdate && data.transaction) {
            onStatusUpdate(data.transaction.status, data.transaction);
          }
          break;
        case 'status_update':
          console.log('🔄 SSE - Estado actualizado:', {
            status: data.status,
            transactionId: data.transaction?.id,
            reference: data.transaction?.reference,
            amount: data.transaction?.amountInCents,
            timestamp: data.timestamp
          });
          if (onStatusUpdate) {
            onStatusUpdate(data.status, data.transaction);
          }
          // Desconectar después de actualización final
          if (data.status === 'APPROVED' || data.status === 'DECLINED' || data.status === 'ERROR') {
            console.log('🔌 SSE - Desconectando después de estado final:', data.status);
            SSEService.disconnect();
          }
          break;
        case 'heartbeat':
          console.log('💓 SSE - Heartbeat recibido:', {
            transactionId: data.transactionId,
            currentStatus: data.currentStatus,
            timestamp: data.timestamp
          });
          // Si el heartbeat incluye un estado actualizado, procesarlo
          if (data.currentStatus && data.currentStatus !== 'PENDING') {
            console.log('🔄 SSE - Estado actualizado via heartbeat:', data.currentStatus);
            if (onStatusUpdate) {
              onStatusUpdate(data.currentStatus, null);
            }
            // Desconectar si es estado final
            if (data.currentStatus === 'APPROVED' || data.currentStatus === 'DECLINED' || data.currentStatus === 'ERROR') {
              console.log('🔌 SSE - Desconectando después de estado final via heartbeat:', data.currentStatus);
              SSEService.disconnect();
            }
          }
          break;
        default:
          console.log('❓ SSE - Tipo de mensaje desconocido:', {
            type: data.type,
            data: data
          });
      }
    };

    const handleError = (error: any) => {
      console.error('SSE Connection error:', error);
    };

    console.log('Conectando SSE para transacción:', transactionId);
    SSEService.connect(transactionId, handleMessage, handleError);

    return () => {
      console.log('Desconectando SSE');
      SSEService.disconnect();
    };
  }, [transactionId, onStatusUpdate]);

  return {
    disconnect: () => SSEService.disconnect(),
  };
};