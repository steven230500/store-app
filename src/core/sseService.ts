/* global console */
import EventSource from 'react-native-sse';

class SSEService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();

  connect(transactionId: string, onMessage: (data: any) => void, onError?: (error: any) => void) {
    if (this.eventSource) {
      this.disconnect();
    }

    const url = `http://api.stevenpatino.dev/transactions/${transactionId}/events`;

    this.eventSource = new EventSource(url, {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      method: 'GET',
    });

    this.eventSource.addEventListener('message', (event) => {
      try {
        if (event.data) {
          const data = JSON.parse(event.data);
          console.log('📨 SSE - Mensaje recibido:', {
            type: data.type,
            hasTransaction: !!data.transaction,
            hasTransactionId: !!data.transactionId,
            timestamp: data.timestamp
          });
          onMessage(data);
        }
      } catch (error) {
        console.error('❌ SSE - Error parseando datos:', error);
      }
    });

    this.eventSource.addEventListener('error', (error) => {
      console.error('🚨 SSE - Error de conexión:', error);
      if (onError) onError(error);
    });

    this.eventSource.addEventListener('open', () => {
      console.log('🔗 SSE - Conexión establecida para transacción:', transactionId);
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.removeAllEventListeners();
      this.eventSource.close();
      this.eventSource = null;
      console.log('🔌 SSE - Desconectado');
    }
  }
}

export default new SSEService();