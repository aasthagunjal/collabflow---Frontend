import apiClient from '../../api/apiClient';

export interface CreateProjectPayload {
    workspaceId?: string;
    name: string;
    description: string;
    status: string;
    progress?: number;
    startDate: string;
    endDate: string;
    members?: string[];
}

export interface ApiProject {
    _id: string;
    workspaceId: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    createdBy: string;
    projectManager: string;
    members: string[];
    deletedAt: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiProjectManager {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface ApiProjectMember {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface ViewProjectResponse {
    project: ApiProject;
    manager: ApiProjectManager | null;
    members: ApiProjectMember[];
}

// Alias for create response (same shape)
export type CreateProjectResponse = ApiProject;

const PROJECT_ENDPOINTS = {
    CREATE: '/projects/create',
    GET_ALL: '/projects/getAllProjects',
    VIEW: '/projects/viewProject',
} as const;

/**
 * Fetches all projects for the authenticated account.
 */
export const getAllProjects = async (): Promise<ApiProject[]> => {
    const response = await apiClient.get<ApiProject[]>(PROJECT_ENDPOINTS.GET_ALL);

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch projects. Please try again.');
    }

    return response.data;
};

/**
 * Fetches full details for a single project by ID.
 */
export const viewProject = async (projectId: string): Promise<ViewProjectResponse> => {
    const response = await apiClient.post<ViewProjectResponse>(PROJECT_ENDPOINTS.VIEW, { projectId });

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch project details. Please try again.');
    }

    return response.data;
};

/**
 * Creates a new workspace project via the API.
 */
export const createProject = async (
    payload: CreateProjectPayload
): Promise<CreateProjectResponse> => {
    const response = await apiClient.post<CreateProjectResponse>(
        PROJECT_ENDPOINTS.CREATE,
        payload
    );

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to create project. Please try again.');
    }

    return response.data;
};

/**
 * Maps an API project to the local Project shape used by the UI.
 */
// export const mapApiProjectToLocal = (p: ApiProject) => ({
//     id: p._id,
//     name: p.name,
//     description: p.description,
//     progress: p.progress ?? 0,
//     status: 'In Progress' as const,
//     dueDate: new Date(p.endDate).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//     }),
//     category: 'Mobile',
//     team: [] as any[],
// });
export const mapApiProjectToLocal = (p: ApiProject) => ({
    id: p._id,
    name: p.name,
    description: p.description,
    progress: p.progress ?? 0,

    status:
        p.status === 'completed'
            ? 'Completed'
            : p.status === 'archived'
                ? 'Archived'
                : 'Active',

    dueDate: new Date(p.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }),

    category: 'Mobile',
    team: [],
});

/**
 * Returns a human-friendly error message for project failures.
 */
export const resolveProjectError = (err: any): string => {
    const status = err?.response?.status;
    const serverMessage: string | undefined = err?.response?.data?.message;

    if (status === 400 || status === 422) return serverMessage ?? 'Invalid project details. Please check your inputs.';
    if (status === 401 || status === 403) return 'You are not authorized to perform this action.';
    if (status === 404) return 'Project not found. Please refresh and try again.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again later.';
    if (!err?.response) return 'Unable to reach the server. Check your internet connection.';
    return serverMessage ?? 'Operation failed. Please try again.';
};
