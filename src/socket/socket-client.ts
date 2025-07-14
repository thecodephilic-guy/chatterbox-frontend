import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './socket-events';

let SERVER_URL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:8080';

if (SERVER_URL.endsWith("/api")) {
  SERVER_URL = SERVER_URL.slice(0, -4);
}

class SocketClient {
  private static socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private constructor() {}

  public static init(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!SocketClient.socket) {
      SocketClient.socket = io(SERVER_URL, {
        withCredentials: true,
        autoConnect: false, // Manual connection control
      });
    }
    return SocketClient.socket;
  }
}

export default SocketClient;