export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  createdAt: string;
  updatedAt: string;
}

export interface ActiveUsers {
  userId: string;
  socketId: string;
};