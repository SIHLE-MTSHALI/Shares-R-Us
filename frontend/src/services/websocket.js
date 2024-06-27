import io from 'socket.io-client';
import { addNotification } from '../redux/reducers/notificationsReducer';
import store from '../redux/store';

const socket = io('http://localhost:5000'); // Replace with your WebSocket server URL

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('priceUpdate', (data) => {
  store.dispatch({ type: 'UPDATE_ASSET_PRICE', payload: data });
});

socket.on('notification', (data) => {
  store.dispatch(addNotification(data));
});

export const subscribeToAsset = (assetSymbol) => {
  socket.emit('subscribeToAsset', assetSymbol);
};

export const unsubscribeFromAsset = (assetSymbol) => {
  socket.emit('unsubscribeFromAsset', assetSymbol);
};

export default socket;