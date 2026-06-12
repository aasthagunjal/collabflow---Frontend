import { AxiosError } from 'axios';

export const parseApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data;
    if (errorResponse && typeof errorResponse === 'object' && 'error' in errorResponse) {
      const apiErr = (errorResponse as any).error;
      if (apiErr && typeof apiErr === 'object' && apiErr.message) {
        return apiErr.message;
      }
    }
    return error.message || 'API request connection failed.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected issue occurred. Please check your network and try again.';
};
