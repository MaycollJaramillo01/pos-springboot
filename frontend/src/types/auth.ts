export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
