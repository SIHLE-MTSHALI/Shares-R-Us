import io from 'socket.io-client';

const WEBSOCKET_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connect();
  }

  connect() {
    this.socket = io(WEBSOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  subscribeToAsset(symbol) {
    if (this.socket) {
      this.socket.emit('subscribe', symbol);
    }
  }

  unsubscribeFromAsset(symbol) {
    if (this.socket) {
      this.socket.emit('unsubscribe', symbol);
    }
  }

  onPriceUpdate(callback) {
    if (this.socket) {
      this.socket.on('priceUpdate', callback);
    }
  }

  offPriceUpdate() {
    if (this.socket) {
      this.socket.off('priceUpdate');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;