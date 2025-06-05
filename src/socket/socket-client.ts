import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './socket-events';

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

class SocketClient {
  private static instance: Socket<ServerToClientEvents, ClientToServerEvents>;

  private constructor() {}

  public static getInstance(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!SocketClient.instance) {
      SocketClient.instance = io(SERVER_URL, {
        withCredentials: true,
        autoConnect: false, // Manual connection control
      });
    }
    return SocketClient.instance;
  }
}

export default SocketClient;