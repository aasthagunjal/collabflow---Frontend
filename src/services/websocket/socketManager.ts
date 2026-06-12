import socketClient from './socketClient';
import { SocketEventListener } from './socketTypes';

export const socketManager = {
  subscribe: (event: string, listener: SocketEventListener) => {
    return socketClient.subscribe(event, listener);
  },

  publish: (event: string, payload: any) => {
    socketClient.send(event, payload);
  },

  getConnectionState: () => {
    return socketClient.getConnectionState();
  },

  onStateChange: (listener: (state: string) => void) => {
    return socketClient.onStateChange(listener);
  },
};
export default socketManager;
