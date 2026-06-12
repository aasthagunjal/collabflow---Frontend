import { REGEX } from '../constants/regex';

export const validateEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  // Can expand strength checks here
  return password.length >= 6;
};

export const validateRequired = (val: string): boolean => {
  return val.trim().length > 0;
};
