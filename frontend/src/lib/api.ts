const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'An error occurred');
    }

    return res.json();
}

export const authApi = {
    login: (credentials: any) => apiRequest('/auth/login', {
        method: 'POST',
        body: new URLSearchParams(credentials),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
    signup: (userData: any) => apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
};

// Projects API
export const projectsApi = {
    list: () => apiRequest('/projects'),
    get: (id: number) => apiRequest(`/projects/${id}`),
    create: (data: any) => apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id: number, data: any) => apiRequest(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id: number) => apiRequest(`/projects/${id}`, {
        method: 'DELETE'
    }),

    // Milestones
    getMilestones: (projectId: number) =>
        apiRequest(`/projects/${projectId}/milestones`),
    getMilestone: (projectId: number, week: number) =>
        apiRequest(`/projects/${projectId}/milestones/${week}`),
    createMilestone: (projectId: number, data: any) =>
        apiRequest(`/projects/${projectId}/milestones`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateMilestone: (projectId: number, week: number, data: any) =>
        apiRequest(`/projects/${projectId}/milestones/${week}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    deleteMilestone: (projectId: number, week: number) =>
        apiRequest(`/projects/${projectId}/milestones/${week}`, {
            method: 'DELETE'
        }),

    // Resources
    addResource: (projectId: number, data: any) =>
        apiRequest(`/projects/${projectId}/resources`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    deleteResource: (projectId: number, resourceId: number) =>
        apiRequest(`/projects/${projectId}/resources/${resourceId}`, {
            method: 'DELETE'
        }),

    // Submissions
    submit: (projectId: number, week: number, data: any) =>
        apiRequest(`/projects/${projectId}/milestones/${week}/submit`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    listSubmissions: (projectId: number) =>
        apiRequest(`/projects/${projectId}/submissions`),
    listMySubmissions: (projectId: number) =>
        apiRequest(`/projects/${projectId}/my-submissions`),

    // Team assignments
    assignTeam: (projectId: number, teamId: number) =>
        apiRequest(`/projects/${projectId}/assign-team`, {
            method: 'POST',
            body: JSON.stringify({ team_id: teamId, project_id: projectId })
        }),
    unassignTeam: (projectId: number, teamId: number) =>
        apiRequest(`/projects/${projectId}/assign-team/${teamId}`, {
            method: 'DELETE'
        }),
    listAssignedTeams: (projectId: number) =>
        apiRequest(`/projects/${projectId}/teams`),
};
