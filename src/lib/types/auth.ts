export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  username: string;
  password: string;
  gender: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  error?: string;
  data: {
    id: string;
    name: string;
    username: string;
    gender: string;
    lastSeen: string | null;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
  };
}