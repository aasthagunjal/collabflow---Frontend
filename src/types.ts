export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  organization?: string;
  initials?: string;
}

export type ProjectStatus = 'In Progress' | 'On Hold' | 'Completed' | 'Archived' | 'Priority Alpha';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // 0 to 100
  status: ProjectStatus;
  dueDate: string;
  team: User[];
  category: string;
  image?: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignee: User;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  description?: string;
  subtasks?: Subtask[];
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: User;
  timestamp: string;
  content: string;
  reactions?: Reaction[];
  codeSnippet?: {
    filename: string;
    code: string;
  };
  imageUrl?: string;
}

export interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

export interface RecentActivity {
  id: string;
  user: User;
  action: string;
  target: string;
  timeAgo: string;
  category: string;
  type: 'move' | 'complete' | 'system' | 'update';
}
