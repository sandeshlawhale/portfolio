"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalyticsStats } from "@/utils/api/analytics";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area
} from "recharts";
import {
    Users, MousePointer2, Clock, Smartphone, Monitor, Tablet,
    ArrowUpRight, ArrowDownRight, Filter, Loader2, Link as LinkIcon,
    Mail, MessageSquare, Linkedin, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#818cf8", "#c084fc", "#fb7185", "#38bdf8", "#4ade80"];

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            fetchStats();
        }
    }, [router, days]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getAnalyticsStats(days);
            if (data.success) {
                setStats(data.result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    const totalViews = stats?.categoryViews?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
    const totalInteractions = stats?.interactions?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

    // Format interaction data for the chart
    const interactionData = stats?.interactions?.map((item: any) => ({
        name: item._id.replace(/_/g, ' '),
        count: item.count
    })) || [];

    // Format time series for trend
    const trendData = stats?.timeSeries?.reduce((acc: any[], curr: any) => {
        const existing = acc.find(a => a.date === curr._id.date);
        if (existing) {
            existing[curr._id.category] = curr.count;
            existing.total = (existing.total || 0) + curr.count;
        } else {
            acc.push({
                date: curr._id.date,
                [curr._id.category]: curr.count,
                total: curr.count
            });
        }
        return acc;
    }, []) || [];

    const deviceData = stats?.devices?.map((item: any) => ({
        name: item._id,
        value: item.count
    })) || [];

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Track how your portfolio is performing.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border shadow-sm">
                    {[7, 30, 90].map((d) => (
                        <Button
                            key={d}
                            variant={days === d ? "default" : "ghost"}
                            size="sm"
                            className="h-8 rounded-lg text-xs"
                            onClick={() => setDays(d)}
                        >
                            Last {d} Days
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Gathering your data...</p>
                </div>
            ) : (
                <>
                    {/* Top Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Page Views"
                            value={totalViews}
                            icon={Users}
                            description="Total visitors across all pages"
                        />
                        <StatCard
                            title="Total Interactions"
                            value={totalInteractions}
                            icon={MousePointer2}
                            description="Clicks on social, contact, resume"
                            color="indigo"
                        />
                        <StatCard
                            title="Avg Time on Page"
                            value={`${Math.round(stats?.avgTime?.[0]?.avgDuration || 0)}s`}
                            icon={Clock}
                            description="Mean duration per session"
                            color="rose"
                        />
                        <StatCard
                            title="Primary Device"
                            value={deviceData[0]?.name || "N/A"}
                            icon={Monitor}
                            description="Most used device type"
                            color="sky"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-7">
                        {/* Traffic Trend Chart */}
                        <div className="md:col-span-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                Traffic Trend
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#64748b' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                                            itemStyle={{ fontSize: '12px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#818cf8"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Page Views Breakdown */}
                        <div className="md:col-span-3 p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <h3 className="text-lg font-semibold mb-6">Page Distribution</h3>
                            <div className="space-y-4">
                                {stats?.categoryViews?.map((item: any, i: number) => (
                                    <div key={item._id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-sm capitalize font-medium">{item._id.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold">{item.count}</span>
                                            <div className="w-24 h-2 bg-accent/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${(item.count / totalViews) * 100}%`,
                                                        backgroundColor: COLORS[i % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50">
                                <h4 className="text-sm text-muted-foreground mb-4 font-bold flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Device Distribution
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {['mobile', 'tablet', 'desktop'].map((type) => {
                                        const device = deviceData.find((d: any) => d.name === type) || { name: type, value: 0 };
                                        const Icon = type === 'mobile' ? Smartphone : type === 'tablet' ? Tablet : Monitor;
                                        return (
                                            <div key={type} className="p-3 rounded-xl bg-accent/5 border border-border/50 flex flex-col items-center gap-1">
                                                <Icon className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-bold">{device.value}</span>
                                                <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Interactions Chart */}
                        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <h3 className="text-lg font-semibold mb-6">Specific Interactions</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={interactionData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                                            width={100}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Events List */}
                        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                            <h3 className="text-lg font-semibold mb-6">Popular Pages</h3>
                            <div className="space-y-4">
                                {stats?.avgTime?.sort((a: any, b: any) => b.avgDuration - a.avgDuration).slice(0, 5).map((page: any) => (
                                    <div key={page._id} className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-border/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <LinkIcon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold capitalize">{page._id.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] text-muted-foreground">Highest retention page</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{Math.round(page.avgDuration)}s</p>
                                            <p className="text-[10px] text-muted-foreground">Avg Duration</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, description, color = "primary" }: any) {
    const colorVariants: any = {
        primary: "text-primary bg-primary/10",
        indigo: "text-indigo-500 bg-indigo-500/10",
        rose: "text-rose-500 bg-rose-500/10",
        sky: "text-sky-500 bg-sky-500/10",
    };

    return (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${colorVariants[color] || colorVariants.primary}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">
                    +12%
                </Badge>
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="text-2xl font-bold mt-1">{value}</div>
                <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    );
}
