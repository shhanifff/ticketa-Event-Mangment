import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

console.log('Socket instance:', socket);

export default socket;