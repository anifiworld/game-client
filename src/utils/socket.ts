import { io } from 'socket.io-client';
import { WEB_SOCKET_BASE_URL } from '../constants/Urls';

export const socketClient = io('/', {
  path: WEB_SOCKET_BASE_URL,
});
