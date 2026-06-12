import { useEffect, useState } from 'react';
import socketManager from '../services/websocket/socketManager';
import { SocketConnectionState } from '../services/websocket/socketTypes';

export const useWebSocket = () => {
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(
    socketManager.getConnectionState()
  );

  useEffect(() => {
    const unsubscribe = socketManager.onStateChange((state) => {
      setConnectionState(state as SocketConnectionState);
    });
    return unsubscribe;
  }, []);

  const sendMessage = (event: string, payload: any) => {
    socketManager.publish(event, payload);
  };

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    sendMessage,
  };
};
export default useWebSocket;
