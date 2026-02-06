const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SystemInfo {
    lastContentUpdate: string;
    frontendVersion: string;
    environment: string;
    lastCacheRefreshAt: string;
}

export interface AdminLog {
    _id: string;
    actionType: string;
    entityAffected: string;
    timestamp: string;
}

export interface HealthStatus {
    status: string;
    api: string;
    database: string;
    uptime: number;
    timestamp: string;
}

export const getHealth = async (): Promise<HealthStatus> => {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    return data;
};

export const getSystemInfo = async (): Promise<SystemInfo> => {
    const response = await fetch(`${API_URL}/api/v1/admin/system/info`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const data = await response.json();
    return data.result;
};

export const refreshCache = async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/api/v1/admin/system/refresh-cache`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return await response.json();
};

export const getAdminLogs = async (): Promise<AdminLog[]> => {
    const response = await fetch(`${API_URL}/api/v1/admin/system/logs`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const data = await response.json();
    return data.result;
};

export const reportVersion = async (version: string): Promise<void> => {
    await fetch(`${API_URL}/api/v1/admin/system/version`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ version }),
    });
};
