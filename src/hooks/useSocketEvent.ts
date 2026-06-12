import { useEffect, useRef } from 'react';
import socketManager from '../services/websocket/socketManager';
import { SocketEventListener } from '../services/websocket/socketTypes';

export const useSocketEvent = <T = any>(event: string, callback: SocketEventListener<T>) => {
  const savedCallback = useRef<SocketEventListener<T>>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener = (payload: T) => {
      savedCallback.current(payload);
    };

    const unsubscribe = socketManager.subscribe(event, listener);
    return () => {
      unsubscribe();
    };
  }, [event]);
};
export default useSocketEvent;
