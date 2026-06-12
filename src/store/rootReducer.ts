import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
