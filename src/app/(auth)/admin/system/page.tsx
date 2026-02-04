"use client";

import React, { useEffect, useState } from "react";
import {
    Activity,
    RefreshCcw,
    Server,
    Database,
    Clock,
    Info,
    Terminal,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { getHealth, getSystemInfo, refreshCache, getAdminLogs, reportVersion, HealthStatus, SystemInfo, AdminLog } from "@/utils/api/system";
import { format } from "date-fns";

const FRONTEND_VERSION = "1.0.1"; // This would ideally come from package.json or env

const SystemPage = () => {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [info, setInfo] = useState<SystemInfo | null>(null);
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [healthData, infoData, logsData] = await Promise.all([
                getHealth(),
                getSystemInfo(),
                getAdminLogs()
            ]);
            setHealth(healthData);
            setInfo(infoData);
            setLogs(logsData);
        } catch (error) {
            console.error("Failed to fetch system data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reportVersion(FRONTEND_VERSION);
        fetchData();
        const interval = setInterval(async () => {
            const healthData = await getHealth();
            setHealth(healthData);
        }, 10000); // Poll health every 10s

        return () => clearInterval(interval);
    }, []);

    const handleRefreshCache = async () => {
        setRefreshing(true);
        try {
            const res = await refreshCache();
            if (res.success) {
                // Refresh info to update timestamp
                const infoData = await getSystemInfo();
                setInfo(infoData);
                // Refresh logs
                const logsData = await getAdminLogs();
                setLogs(logsData);
            }
        } catch (error) {
            console.error("Failed to refresh cache:", error);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading System Data...</div>;
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primaryText">System Control</h1>
                    <p className="text-mutedText">Observability and system-level management</p>
                </div>
                <button
                    onClick={handleRefreshCache}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                    <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh System Cache'}
                </button>
            </header>

            {/* Health Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="API Status"
                    value={health?.api === "online" ? "Healthy" : "Down"}
                    subValue="V1 Production"
                    icon={Server}
                    status={health?.api === "online" ? "success" : "danger"}
                />
                <StatusCard
                    title="Database"
                    value={health?.database === "connected" ? "Connected" : "Error"}
                    subValue="MongoDB Cluster"
                    icon={Database}
                    status={health?.database === "connected" ? "success" : "danger"}
                />
                <StatusCard
                    title="System Uptime"
                    value={formatUptime(health?.uptime || 0)}
                    subValue="Server process active"
                    icon={Activity}
                    status="neutral"
                />
                <StatusCard
                    title="Environment"
                    value={info?.environment || "Unknown"}
                    subValue={`v${info?.frontendVersion}`}
                    icon={Terminal}
                    status="neutral"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Info Table */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-400" />
                            System Metadata
                        </h3>
                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-mutedText">Last Content Update</span>
                                <span className="text-primaryText">{info?.lastContentUpdate ? format(new Date(info.lastContentUpdate), 'MMM d, HH:mm') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-mutedText">Last Cache Refresh</span>
                                <span className="text-primaryText">{info?.lastCacheRefreshAt ? format(new Date(info.lastCacheRefreshAt), 'MMM d, HH:mm') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-mutedText">Frontend Version</span>
                                <span className="text-indigo-400">{info?.frontendVersion}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-mutedText">Backend Status</span>
                                <span className="flex items-center gap-1 text-emerald-500">
                                    <CheckCircle2 className="w-4 h-4" /> Live
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-2xl h-full shadow-sm flex flex-col">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-indigo-400" />
                                Admin Activity Log
                            </h3>
                        </div>
                        <div className="flex-1 overflow-auto max-h-[400px]">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-mutedText">
                                    <tr>
                                        <th className="px-6 py-3">Timestamp</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Entity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {logs.map((log) => (
                                        <tr key={log._id} className="hover:bg-accent/5 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-mutedText whitespace-nowrap">
                                                {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getActionColor(log.actionType)}`}>
                                                    {log.actionType.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-primaryText truncate max-w-[200px]">
                                                {log.entityAffected || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-mutedText font-bold">
                                                No activity recorded yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, subValue, icon: Icon, status }: any) => {
    const statusConfig = {
        success: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', icon: CheckCircle2 },
        danger: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', icon: XCircle },
        neutral: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: Activity },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.neutral;
    const StatusIcon = config.icon;

    return (
        <div className={`p-6 rounded-2xl border ${config.border} bg-card shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${config.bg} ${config.text}`}>
                    <Icon className="w-5 h-5 " />
                </div>
                <StatusIcon className={`w-4 h-4 ${config.text}`} />
            </div>
            <div>
                <h4 className="text-xs font-bold text-mutedText uppercase tracking-wider mb-1">{title}</h4>
                <p className="text-xl font-bold text-primaryText">{value}</p>
                <p className="text-xs font-bold text-mutedText mt-1">{subValue}</p>
            </div>
        </div>
    );
};

const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${seconds % 60}s`;
};

const getActionColor = (type: string) => {
    if (type.startsWith('created') || type.startsWith('added')) return 'bg-emerald-500/10 text-emerald-500';
    if (type.startsWith('updated')) return 'bg-indigo-500/10 text-indigo-400';
    if (type.startsWith('deleted')) return 'bg-rose-500/10 text-rose-500';
    return 'bg-amber-500/10 text-amber-500';
};

export default SystemPage;
