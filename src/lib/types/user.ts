export interface User {
  id: string;
  name: string;
  username: string;
  gender: string;
  lastSeen: Date;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date;
}

export interface UsersResponse {
  status: number;
  message: string;
  data: User[];
}

export interface ActiveUsers {
  userId: string;
  socketId: string;
}
