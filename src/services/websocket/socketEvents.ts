export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Realtime action events
  MESSAGE_CREATED: 'message:created',
  MESSAGE_REACTION: 'message:reaction',
  TASK_STATUS_UPDATED: 'task:status_updated',
  TASK_SUBTASK_UPDATED: 'task:subtask_updated',
  TASK_COMMENT_ADDED: 'task:comment_added',
  PROJECT_CREATED: 'project:created',
  TYPING_INDICATOR: 'typing_indicator',
} as const;
