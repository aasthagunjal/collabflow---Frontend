export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_STRENGTH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Min 8 chars, 1 upper, 1 lower, 1 digit
} as const;
