import { useEffect } from 'react';
import SSEService from './sseService';

export const useSSE = (transactionId: string | null, onStatusUpdate?: (status: string, transaction: any) => void) => {

  useEffect(() => {
    if (!transactionId) return;

    const handleMessage = (data: any) => {
      switch (data.type) {
        case 'initial':
          if (onStatusUpdate && data.transaction) {
            onStatusUpdate(data.transaction.status, data.transaction);
          }
          break;
        case 'status_update':
          if (onStatusUpdate) {
            onStatusUpdate(data.status, data.transaction);
          }
          if (data.status === 'APPROVED' || data.status === 'DECLINED' || data.status === 'ERROR') {
            SSEService.disconnect();
          }
          break;
        case 'heartbeat':
          if (data.currentStatus && data.currentStatus !== 'PENDING') {
            if (onStatusUpdate) {
              onStatusUpdate(data.currentStatus, null);
            }
            if (data.currentStatus === 'APPROVED' || data.currentStatus === 'DECLINED' || data.currentStatus === 'ERROR') {
              SSEService.disconnect();
            }
          }
          break;
      }
    };

    const handleError = (error: any) => {
      console.error('SSE Connection error:', error);
    };

    SSEService.connect(transactionId, handleMessage, handleError);

    return () => {
      SSEService.disconnect();
    };
  }, [transactionId, onStatusUpdate]);

  return {
    disconnect: () => SSEService.disconnect(),
  };
};