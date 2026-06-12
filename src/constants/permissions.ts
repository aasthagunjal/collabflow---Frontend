export const ROLES = {
  ADMIN: 'Workspace Admin',
  MEMBER: 'Workspace Member',
  USER: 'Workspace User',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
