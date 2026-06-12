# Register API Integration

## Overview

This document describes the real API integration for the CollabFlow user registration feature,
replacing the previous mock-user creation with a live REST endpoint.

---

## Endpoint

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{VITE_API_URL}/users` |
| **Content-Type** | `application/json` |
| **Auth required** | No |

### Request Body

```json
{
  "email": "rahul@example.com",
  "password": "Password123",
  "firstName": "Rahul",
  "lastName": "Snow"
}
```

### Success Response `200 OK`

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "6a2aa6d3af9659c8e1daf054",
    "email": "rahul@example.com",
    "firstName": "Rahul",
    "lastName": "Snow",
    "avatar": null,
    "isVerified": false,
    "lastLoginAt": null,
    "createdAt": "2026-06-11T12:15:15.796Z",
    "updatedAt": "2026-06-11T12:15:15.796Z"
  }
}
```

> The register endpoint does **not** return tokens. After successful registration,
> the user is automatically redirected to the login page to sign in.

---

## File Changes

### Modified Files

| File | Change |
|------|--------|
| `src/types/auth.ts` | Updated `RegisterCredentials` to use `firstName` + `lastName` (not `name`); added `RegisterResponseData` interface |
| `src/services/auth/authService.ts` | Added `registerUser()` function, `resolveRegisterError()` error resolver, and `/users` endpoint constant |
| `src/store/slices/authSlice.ts` | Added `registerStart`, `registerFailure` actions; updated `registerSuccess` — does not set `isAuthenticated` since no token is issued |
| `src/modules/RegisterView.tsx` | Wired to `authService.registerUser`; split name into `firstName`/`lastName` fields; added loading spinner, success banner, error display, password show/hide toggle, fixed width card |

---

## Architecture

```
RegisterView.tsx
  │
  ├── dispatches registerStart()         → sets isLoading = true
  │
  ├── calls authService.registerUser()
  │     └── apiClient.post('/users', credentials)
  │           └── axiosInstance (baseURL = VITE_API_URL)
  │
  ├── on success → dispatches registerSuccess(User)
  │     └── shows green success banner for 1.8s
  │     └── dispatches setAuthRoute('login')
  │     └── calls onNavigateToLogin() → App.tsx shows LoginView
  │
  └── on failure → dispatches registerFailure(message)
        └── error rendered inline in the form
```

---

## Error Handling

| Scenario | Message shown |
|----------|---------------|
| Email already registered (409) | "An account with this email already exists. Try signing in." |
| Validation error (400 / 422) | Server message, or "Invalid details. Please check your inputs." |
| Too many requests (429) | "Too many requests. Please wait a moment and try again." |
| Server error (5xx) | "Server error. Please try again later." |
| No network | "Unable to reach the server. Check your internet connection." |
| Empty first/last name | Client-side: "Please enter your first and last name." |
| Empty email | Client-side: "Please enter a valid email address." |
| Empty password | Client-side: "Please enter a password." |

---

## UI Improvements

- **Fixed width card** (`w-[360px]`) — card never stretches with error/success text
- **Reserved feedback slot** (`min-h-[36px]`) — no layout shift when banners appear/disappear
- **Success banner** — green confirmation shown for 1.8s before redirect
- **Password visibility toggle** — Eye / EyeOff icon button on the password field
- **Split name fields** — First Name + Last Name in a two-column grid matching the API contract
- **Loading state** — button shows spinner and "Creating account…" during the request
- **All inputs disabled** during request to prevent double submission

---

## Post-Registration Flow

Since the register endpoint does not issue tokens, the app redirects to login:

```
Register form submit
  → API call succeeds
  → Success banner shown (1.8s)
  → setAuthRoute('login') dispatched
  → LoginView rendered with pre-filled email
  → User signs in to get access token
```
