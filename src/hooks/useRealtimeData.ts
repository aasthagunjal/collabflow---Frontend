import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { addChatMessage, updateTaskStatus, updateSubtask, addTaskComment, addProject } from '../store/slices/workspaceSlice';
import { useSocketEvent } from './useSocketEvent';
import { SOCKET_EVENTS } from '../services/websocket/socketEvents';
import { ChatMessage, Task, Project, TaskStatus } from '../types/common';

export const useRealtimeData = () => {
  const dispatch = useAppDispatch();

  // Listen for message broadcasts
  useSocketEvent<ChatMessage>(SOCKET_EVENTS.MESSAGE_CREATED, (message) => {
    dispatch(addChatMessage(message));
  });

  // Listen for task status updates
  useSocketEvent<{ taskId: string; newStatus: TaskStatus }>(SOCKET_EVENTS.TASK_STATUS_UPDATED, (data) => {
    dispatch(updateTaskStatus(data));
  });

  // Listen for subtask checks
  useSocketEvent<{ taskId: string; subtaskId: string; completed: boolean }>(SOCKET_EVENTS.TASK_SUBTASK_UPDATED, (data) => {
    dispatch(updateSubtask(data));
  });

  // Listen for task comments
  useSocketEvent<{ taskId: string; comment: string }>(SOCKET_EVENTS.TASK_COMMENT_ADDED, (data) => {
    dispatch(addTaskComment(data));
  });

  // Listen for project creation
  useSocketEvent<Project>(SOCKET_EVENTS.PROJECT_CREATED, (project) => {
    dispatch(addProject(project));
  });
};
export default useRealtimeData;
