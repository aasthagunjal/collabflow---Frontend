import apiClient from '../../api/apiClient';
import { ApiResponse } from '../../types/api';

export interface CreateTaskPayload {
    projectId: string;
    title: string;
    taskType?: string;
    statusId?: string;
    assigneeId?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    storyPoints?: number;
    timeEstimateHours?: number;
    dueDate?: string;
    metadata?: Record<string, any>;
}

export interface ApiTask {
    _id: string;
    projectId: string;
    parentTaskId: string | null;
    title: string;
    description: string;
    key: string;
    taskType: string;
    statusId: string;
    priority: string;
    assigneeId: string;
    reporterId: string;
    storyPoints: number;
    timeEstimateHours: number;
    timeSpentHours: number;
    dueDate: string;
    position: number;
    metadata: Record<string, any>;
    deletedAt: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiTaskProject {
    _id: string;
    name: string;
}

export interface GetTasksApiResponse extends ApiResponse<ApiTask[]> {
    projects: ApiTaskProject[];
}

export interface GetTasksResponse {
    tasks: ApiTask[];
    projects: ApiTaskProject[];
}

const TASK_ENDPOINTS = {
    CREATE: '/tasks',
    GET_ALL: '/tasks/getTasks',
} as const;

/**
 * Fetches all tasks for the authenticated user's projects.
 * Returns both tasks and projects from the API response.
 */
export const getAllTasks = async (): Promise<GetTasksResponse> => {
    const response = await apiClient.get<ApiTask[]>(TASK_ENDPOINTS.GET_ALL) as GetTasksApiResponse;

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch tasks. Please try again.');
    }

    console.log('API response for getAllTasks:', response);

    return {
        tasks: response.data || [],
        projects: response.projects || [],
    };
};

/**
 * Creates a new task via the API.
 */
export const createTask = async (payload: CreateTaskPayload): Promise<ApiTask> => {
    const response = await apiClient.post<ApiTask>(TASK_ENDPOINTS.CREATE, payload);

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to create task. Please try again.');
    }

    return response.data;
};

/**
 * Maps an API task to the local Task shape used by the UI.
 */
export const mapApiTaskToLocal = (t: ApiTask, projectName = 'Unknown Project') => ({
    id: t.key || t._id,
    title: t.title,
    projectId: t.projectId,
    projectName,
    assignee: {
        id: t.assigneeId ?? '',
        name: t.assigneeId ?? 'Unassigned',
        email: '',
        avatar: '',
        role: '',
        initials: t.assigneeId ? t.assigneeId.slice(0, 2).toUpperCase() : 'UN',
    },
    priority: capitalise(t.priority) as 'High' | 'Medium' | 'Low',
    status: mapStatus(t.statusId),
    dueDate: t.dueDate
        ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
    description: t.description ?? '',
    subtasks: [],
    commentsCount: 0,
    attachmentsCount: 0,
});

/**
 * Maps a minimal API project (from getTasks response) to the local Project shape.
 * Used for projects returned alongside tasks in the getTasks endpoint.
 */
export const mapApiTaskProjectToLocal = (p: ApiTaskProject) => ({
    id: p._id,
    name: p.name,
    description: '',
    progress: 0,
    status: 'In Progress' as const,
    dueDate: '',
    team: [],
    category: '',
});

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const mapStatus = (statusId: string): 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done' => {
    switch (statusId?.toLowerCase()) {
        case 'open': return 'Todo';
        case 'in-progress': return 'In Progress';
        case 'review': return 'Review';
        case 'done': return 'Done';
        default: return 'Backlog';
    }
};

/**
 * Returns a human-friendly error message for task failures.
 */
export const resolveTaskError = (err: any): string => {
    const status = err?.response?.status;
    const serverMessage: string | undefined = err?.response?.data?.message;

    if (status === 400 || status === 422) return serverMessage ?? 'Invalid task details. Please check your inputs.';
    if (status === 401 || status === 403) return 'You are not authorized to perform this action.';
    if (status === 404) return 'Project not found. Please refresh and try again.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again later.';
    if (!err?.response) return 'Unable to reach the server. Check your internet connection.';
    return serverMessage ?? 'Failed to perform task operation. Please try again.';
};
