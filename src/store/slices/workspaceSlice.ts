import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Task, ChatMessage, TaskStatus } from '../../types/common';
import { initialProjects, initialTasks, chatMessages as initialChatMessages } from '../../data';

interface WorkspaceState {
  projectsList: Project[];
  tasksList: Task[];
  chatMessages: ChatMessage[];
  selectedChannelId: string;
  searchQuery: string;
  showCreateModal: boolean;
  modalType: 'task' | 'project';
  infoPaneOpen: boolean;
  currentView: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat';
}

const initialState: WorkspaceState = {
  projectsList: initialProjects,
  tasksList: initialTasks,
  chatMessages: initialChatMessages,
  selectedChannelId: 'ch-frontend',
  searchQuery: '',
  showCreateModal: false,
  modalType: 'task',
  infoPaneOpen: true,
  currentView: 'dashboard',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setProjectsList: (state, action: PayloadAction<Project[]>) => {
      state.projectsList = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projectsList.unshift(action.payload);
    },
    setTasksList: (state, action: PayloadAction<Task[]>) => {
      state.tasksList = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasksList.unshift(action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>) => {
      const { taskId, newStatus } = action.payload;
      state.tasksList = state.tasksList.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
    },
    updateSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string; completed: boolean }>) => {
      const { taskId, subtaskId, completed } = action.payload;
      state.tasksList = state.tasksList.map(t => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks?.map(s =>
          s.id === subtaskId ? { ...s, completed } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      });
    },
    addTaskComment: (state, action: PayloadAction<{ taskId: string; comment: string }>) => {
      const { taskId } = action.payload;
      state.tasksList = state.tasksList.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, commentsCount: (t.commentsCount || 0) + 1 };
      });
    },
    setChatMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.chatMessages = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    setSelectedChannelId: (state, action: PayloadAction<string>) => {
      state.selectedChannelId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setShowCreateModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateModal = action.payload;
    },
    setModalType: (state, action: PayloadAction<'task' | 'project'>) => {
      state.modalType = action.payload;
    },
    setInfoPaneOpen: (state, action: PayloadAction<boolean>) => {
      state.infoPaneOpen = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat'>) => {
      state.currentView = action.payload;
      state.searchQuery = ''; // Clear search when changing views
    },
  },
});

export const {
  setProjectsList,
  addProject,
  setTasksList,
  addTask,
  updateTaskStatus,
  updateSubtask,
  addTaskComment,
  setChatMessages,
  addChatMessage,
  setSelectedChannelId,
  setSearchQuery,
  setShowCreateModal,
  setModalType,
  setInfoPaneOpen,
  setCurrentView,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
