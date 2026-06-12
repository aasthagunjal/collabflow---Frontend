export type SocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface SocketEventPacket<T = any> {
  event: string;
  payload: T;
  timestamp: string;
}

export type SocketEventListener<T = any> = (payload: T) => void;

export interface SocketSubscription {
  event: string;
  listener: SocketEventListener;
}
