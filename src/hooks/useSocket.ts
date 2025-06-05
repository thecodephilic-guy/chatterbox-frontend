import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import SocketClient from '@/socket/socket-client';

const useSocket = () => {
  const { isAuthenticated, data } = useAuthStore();

  useEffect(() => {
    const socket = SocketClient.getInstance();

    if (isAuthenticated && typeof data?.id === 'string') {
      socket.connect();
      socket.emit('add-new-user', data.id);
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, data?.id]);
};

export default useSocket;