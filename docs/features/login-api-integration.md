# Login API Integration

## Overview

This document describes the real API integration for the CollabFlow login feature,
replacing the previous mock-user authentication with a live REST endpoint.

---

## Endpoint

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{VITE_API_URL}/auth/login` |
| **Content-Type** | `application/json` |

### Request Body

```json
{
  "email": "rahul@example.com",
  "password": "Password123"
}
```

### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_doc": {
        "_id": "6a2aa6d3af9659c8e1daf054",
        "email": "rahul@example.com",
        "firstName": "Rahul",
        "lastName": "Snow",
        "avatarUrl": null,
        "status": "active",
        "emailVerified": false,
        "createdAt": "2026-06-11T12:15:15.796Z",
        "lastLoginAt": "2026-06-12T06:46:07.644Z"
      }
    },
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>"
  }
}
```

---

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/services/auth/authService.ts` | Encapsulates the login API call and maps the raw API user to the app-level `User` shape |

### Modified Files

| File | Change |
|------|--------|
| `src/types/auth.ts` | Added `ApiUser`, `LoginResponseData`, updated `AuthResponse` to include `refreshToken` |
| `src/constants/storageKeys.ts` | Added `REFRESH_TOKEN` key |
| `src/store/slices/authSlice.ts` | Added `loginStart`, `loginFailure`, `clearAuthError` actions; `loginSuccess` now accepts full `AuthResponse`; stores both `accessToken` and `refreshToken` |
| `src/modules/LoginView.tsx` | Wired to `authService.loginUser`; replaced mock logic with async dispatch; added loading spinner and error display |
| `src/main.tsx` | Wrapped `<App>` with Redux `<Provider>` |
| `.env.example` | Added `VITE_API_URL` variable |

---

## Architecture

```
LoginView.tsx
  │
  ├── dispatches loginStart()          → sets isLoading = true
  │
  ├── calls authService.loginUser()
  │     └── apiClient.post('/auth/login', credentials)
  │           └── axiosInstance (baseURL = VITE_API_URL)
  │                 └── injectRequestInterceptors  (attaches Bearer token)
  │                 └── injectResponseInterceptors (handles 401 logout)
  │
  ├── on success → dispatches loginSuccess(AuthResponse)
  │     └── authSlice stores user + tokens in Redux + localStorage
  │     └── calls onLoginSuccess(user) → App.tsx navigates to dashboard
  │
  └── on failure → dispatches loginFailure(message)
        └── error rendered inline in the form
```

---

## Environment Setup

Copy `.env.example` to `.env` and set the API base URL:

```bash
VITE_API_URL=https://men-academic-despite-greater.trycloudflare.com/api/v1
```

> The axios instance in `src/api/axios.ts` reads `import.meta.env.VITE_API_URL` and
> falls back to `http://localhost:3000/api` when the variable is not set.

---

## Token Storage

| Key | Storage | Value |
|-----|---------|-------|
| `collabflow_token` | `localStorage` | JWT access token |
| `collabflow_refresh_token` | `localStorage` | JWT refresh token |
| `collabflow_user` | `localStorage` | Serialised `User` object |

The request interceptor in `src/api/interceptors.ts` automatically attaches the
access token as `Authorization: Bearer <token>` on every outgoing request.
The response interceptor clears storage and triggers re-login on `401 Unauthorized`.

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Empty email / password | Client-side validation, dispatches `loginFailure` before API call |
| Wrong credentials (4xx) | `err.response.data.message` shown inline in the form |
| Network / server error (5xx) | Generic fallback message shown |
| 401 on any subsequent request | Interceptor clears tokens; user is redirected to login |

---

## Test Credentials

```
Email:    rahul@example.com
Password: Password123
```
