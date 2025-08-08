export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}