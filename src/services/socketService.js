import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('adminToken');
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          auth: {
            token: token
          },
          query: {
            token: token
          }
        });

        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.isConnected = true;
          resolve(this.socket);
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not connected, call connect first');
      return;
    }

    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(callback);

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.off(event, callback);

    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
        if (handlers.length === 0) {
          this.eventHandlers.delete(event);
        }
      }
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not connected, call connect first');
      return Promise.reject(new Error('Socket not connected'));
    }

    return new Promise((resolve) => {
      this.socket.emit(event, data, (response) => {
        resolve(response);
      });
    });
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

const socketService = new SocketService();
export default socketService;