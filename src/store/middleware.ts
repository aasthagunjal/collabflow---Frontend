import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = () => (next) => (action) => {
  // Can add custom telemetry or logic here
  return next(action);
};
