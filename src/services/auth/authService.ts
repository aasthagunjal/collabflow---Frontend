import apiClient from '../../api/apiClient';
import {
    LoginCredentials,
    RegisterCredentials,
    LoginResponseData,
    RegisterResponseData,
    AuthResponse,
} from '../../types/auth';
import { User } from '../../types/common';

const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/users',
} as const;

/**
 * Maps the raw API user object (nested under _doc for login) to the app-level User shape.
 */
const mapApiUserToUser = (apiUser: LoginResponseData['user']): User => {
    const doc = (apiUser as any)._doc ?? apiUser;
    return {
        id: doc._id,
        name: `${doc.firstName} ${doc.lastName}`.trim(),
        email: doc.email,
        avatar: doc.avatarUrl ?? doc.avatar ?? '',
        role: 'Workspace Member',
        initials: `${doc.firstName.charAt(0)}${doc.lastName.charAt(0)}`.toUpperCase(),
    };
};

/**
 * Maps the register response (flat object) to the app-level User shape.
 */
const mapRegisterResponseToUser = (data: RegisterResponseData): User => ({
    id: data._id,
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    avatar: data.avatar ?? '',
    role: 'Workspace Member',
    initials: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
});

/**
 * Returns a human-friendly error message for login failures.
 */
export const resolveLoginError = (err: any): string => {
    const status = err?.response?.status;
    const serverMessage: string | undefined = err?.response?.data?.message;

    if (status === 401 || status === 403) return 'Incorrect email or password. Please try again.';
    if (status === 404) return 'No account found with that email address.';
    if (status === 429) return 'Too many login attempts. Please wait a moment and try again.';
    if (status === 422 || status === 400) return serverMessage ?? 'Invalid request. Please check your details.';
    if (status >= 500) return 'Server error. Please try again later.';
    if (!err?.response) return 'Unable to reach the server. Check your internet connection.';
    return serverMessage ?? 'Login failed. Please try again.';
};

/**
 * Returns a human-friendly error message for register failures.
 */
export const resolveRegisterError = (err: any): string => {
    const status = err?.response?.status;
    const serverMessage: string | undefined = err?.response?.data?.message;

    if (status === 409) return 'An account with this email already exists. Try signing in.';
    if (status === 422 || status === 400) return serverMessage ?? 'Invalid details. Please check your inputs.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again later.';
    if (!err?.response) return 'Unable to reach the server. Check your internet connection.';
    return serverMessage ?? 'Registration failed. Please try again.';
};

/**
 * Authenticates a user with email and password.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<LoginResponseData>(AUTH_ENDPOINTS.LOGIN, credentials);

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Login failed. Please try again.');
    }

    const { user: apiUser, accessToken, refreshToken } = response.data;

    return {
        user: mapApiUserToUser(apiUser),
        token: accessToken,
        refreshToken,
    };
};

/**
 * Registers a new user account.
 * Returns the created User. The register endpoint does not issue tokens,
 * so the caller should redirect to login after success.
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<RegisterResponseData>(AUTH_ENDPOINTS.REGISTER, credentials);

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Registration failed. Please try again.');
    }

    return mapRegisterResponseToUser(response.data);
};
