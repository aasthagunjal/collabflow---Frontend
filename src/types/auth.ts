import { User } from './common';

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Register payload matches the real API: POST /users */
export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Shape of the user object returned by the real API */
export interface ApiUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  avatar: string | null;
  status?: string;
  emailVerified?: boolean;
  isVerified?: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

/** Shape of data returned inside ApiResponse for login */
export interface LoginResponseData {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

/** Shape of data returned inside ApiResponse for register */
export interface RegisterResponseData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Mapped app-level User built from ApiUser */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
