import apiClient from '../../api/apiClient';

export interface DashboardSummary {
    totalProjects: number;
    totalTasks: number;
    activeUsers: number;
    completedTasks: number;
}

export interface ProjectProgress {
    projectId: string;
    name: string;
    progress: number;
    status: string;
    totalTasks: number;
    completedTasks: number;
    dueDate: string;
}

export interface ProductivityPoint {
    date: string;
    value: number;
}

export interface TeamProductivity {
    label: string;
    series: ProductivityPoint[];
}

export interface RecentActivity {
    activityId: string;
    actor: string;
    action: string;
    target: string;
    context: string;
    timestamp: string;
}

export interface UpcomingDeadline {
    taskId: string;
    name: string;
    assignee: string | null;
    priority: string;
    dueDate: string;
    status: string;
}

export interface DashboardData {
    summary: DashboardSummary;
    projectProgress: {
        overallProgress: number;
        projects: ProjectProgress[];
    };
    teamProductivity: TeamProductivity;
    recentActivities: RecentActivity[];
    upcomingDeadlines: UpcomingDeadline[];
}

/**
 * Fetches all dashboard data for the authenticated user.
 */
export const getDashboard = async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard');

    if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch dashboard data.');
    }

    return response.data;
};
