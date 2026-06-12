import { SocketConnectionState, SocketEventListener, SocketEventPacket } from './socketTypes';
import { SOCKET_EVENTS } from './socketEvents';

class SocketClient {
  private socket: WebSocket | null = null;
  private state: SocketConnectionState = 'disconnected';
  private listeners: Map<string, Set<SocketEventListener>> = new Map();
  private stateChangeListeners: Set<(state: SocketConnectionState) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private url = '';
  private simulationTimer: any = null;

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.state === 'connected' || this.state === 'connecting') return;

    if (!this.url) {
      // Run in simulated/mock mode
      this.setConnectionState('connecting');
      setTimeout(() => {
        this.setConnectionState('connected');
        this.startSimulation();
      }, 1000);
      return;
    }

    try {
      this.setConnectionState('connecting');
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.setConnectionState('connected');
        this.reconnectAttempts = 0;
        this.stopSimulation();
      };

      this.socket.onmessage = (event) => {
        try {
          const packet: SocketEventPacket = JSON.parse(event.data);
          this.dispatchEvent(packet.event, packet.payload);
        } catch (e) {
          // Ignore parse errors
        }
      };

      this.socket.onerror = () => {
        this.dispatchEvent(SOCKET_EVENTS.ERROR, new Error('WebSocket connection error'));
      };

      this.socket.onclose = () => {
        this.setConnectionState('disconnected');
        this.handleReconnect();
      };
    } catch (e) {
      this.setConnectionState('disconnected');
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.startSimulation();
      return;
    }
    this.setConnectionState('reconnecting');
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), this.reconnectInterval);
  }

  private setConnectionState(newState: SocketConnectionState) {
    this.state = newState;
    this.stateChangeListeners.forEach(listener => listener(newState));
  }

  public onStateChange(listener: (state: SocketConnectionState) => void) {
    this.stateChangeListeners.add(listener);
    return () => {
      this.stateChangeListeners.delete(listener);
    };
  }

  public getConnectionState(): SocketConnectionState {
    return this.state;
  }

  public subscribe(event: string, listener: SocketEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(listener);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  public send(event: string, payload: any) {
    if (this.state === 'connected' && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, payload, timestamp: new Date().toISOString() }));
    } else {
      setTimeout(() => {
        this.dispatchEvent(event, payload);
      }, 200);
    }
  }

  private dispatchEvent(event: string, payload: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(payload));
    }
  }

  // --- MOCK SIMULATION ENGINE ---
  private startSimulation() {
    this.stopSimulation();
    
    // Simulate real-time activities every 25 seconds
    this.simulationTimer = setInterval(() => {
      const simulations = [
        () => {
          this.dispatchEvent(SOCKET_EVENTS.TYPING_INDICATOR, { user: 'Sarah Chen', isTyping: true });
          setTimeout(() => {
            this.dispatchEvent(SOCKET_EVENTS.TYPING_INDICATOR, { user: 'Sarah Chen', isTyping: false });
            this.dispatchEvent(SOCKET_EVENTS.MESSAGE_CREATED, {
              id: `msg-sim-${Date.now()}`,
              sender: {
                id: 'u-sarahc',
                name: 'Sarah Chen',
                email: 'sarah.c@collabflow.com',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPdFcnThsORuC5oyzhcgqHayXuslrUTuZFyhu3q-uxuu_C4yq2hKM3QQa7K__eTfIrrGCuUbTyfCf5ZL60cOnA6GmMQdzdFlaiAhnaHF9cpxnCpjOXj0zhVwXoe_Uvgj8_etaU5Wncsl2nCeUYUG8jWRMj4S5v0xkgiQ--Dzx9lpxWp00NQr6r3wQUgCGw_2iDt5i7sUts_SxHrMzOfhM21zJEeW6_Ty6leSwJUo0AFOhxiuNjg3jCVJSsstWZx2tz6v-FPUMQhw',
                role: 'UI Designer',
                initials: 'SC'
              },
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              content: 'I uploaded the mobile specifications pdf to the project shared files list.',
            });
          }, 3000);
        },
        () => {
          this.dispatchEvent(SOCKET_EVENTS.TASK_STATUS_UPDATED, {
            taskId: 'CF-103',
            newStatus: 'In Progress',
            activity: {
              id: `act-sim-${Date.now()}`,
              user: {
                id: 'u-marcus',
                name: 'Marcus Wright',
                email: 'marcus@collabflow.com',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA93TV2esgHPbwgR9qVlKCXvDsg_cJ9zPSWo_LIQk46Ezwd_U5S0SCp2LrWWLQ2uGCS2G2cAQtR9ofnPfhzxu1B8KMxVxCT560T1ZAPl2awovKNEupwnSff7kGizkK4vCuXAhe0O65K15AFl4DiB-skh-AaIKEhQpGIwW1mjjkJbi1z1GEhAXcv7FSB3j63zTO9JpIOiclFhhSKec2ss7mYkPkfzzWAMfRLkhd6VNh2t1ns1ZcJ9V94UcKNEoJNkXk2fhs_6lqoJac',
                role: 'Senior Project Manager',
                initials: 'MW'
              },
              action: 'started working on',
              target: 'Setup Kubernetes Cluster autoscaling',
              timeAgo: 'Just now',
              category: 'Kubernetes Cluster',
              type: 'update'
            }
          });
        }
      ];

      const runRandom = simulations[Math.floor(Math.random() * simulations.length)];
      runRandom();
    }, 25000);
  }

  private stopSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }
}

export const socketClient = new SocketClient();
export default socketClient;
