"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalyticsStats } from "@/utils/api/analytics";
import { getAllProjects } from "@/utils/api/projects";
import { getAllWorks } from "@/utils/api/work";
import { getAllTestimonialsAdmin } from "@/utils/api/testimonials";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from "recharts";
import {
    Folder, Briefcase, MessageSquare, Eye, TrendingUp, TrendingDown,
    Sparkles, Zap, PlusCircle, Download, ChevronRight, Info,
    Lightbulb, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

type AvgTimeItem = {
    _id: string;
    avgDuration: number;
};

type CountById = {
    _id: string;
    count: number;
};

type TimeSeriesItem = {
    _id: {
        date: string;
        category: string;
    };
    count: number;
};

type AnalyticsResponse = {
    categoryViews: CountById[];
    interactions: CountById[];
    devices: CountById[];
    timeSeries: TimeSeriesItem[];
    avgTime: AvgTimeItem[];
};

type TrendRow = {
    date: string;
    total: number;
    [category: string]: string | number;
};

export default function AdminPage() {
    const router = useRouter();
    const { setDataLoaded } = useAppContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [stats, setStats] = useState<AnalyticsResponse | null>(null);

    // Entity Counts from APIs
    const [projectCount, setProjectCount] = useState(0);
    const [workCount, setWorkCount] = useState(0);
    const [testimonialCount, setTestimonialCount] = useState(0);
    const [techBreadth, setTechBreadth] = useState<{ name: string; percentage: number }[]>([]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch analytics stats
            const statsData = await getAnalyticsStats(days);
            if (statsData.success) {
                setStats(statsData.result);
            }

            // Fetch live counts
            const [projectsData, worksData, testimonialsData] = await Promise.all([
                getAllProjects().catch(() => ({ result: [] })),
                getAllWorks().catch(() => ({ result: [] })),
                getAllTestimonialsAdmin().catch(() => ({ result: [] }))
            ]);

            const projects = projectsData.result || [];
            setProjectCount(projects.length);
            setWorkCount(worksData.result?.length || 0);
            setTestimonialCount(testimonialsData.result?.length || 0);

            // Compute technology breadth from project tags
            const techCount: Record<string, number> = {};
            projects.forEach((proj: { techstack?: string[] }) => {
                if (Array.isArray(proj.techstack)) {
                    proj.techstack.forEach((tech: string) => {
                        const t = tech.trim();
                        if (t) {
                            techCount[t] = (techCount[t] || 0) + 1;
                        }
                    });
                }
            });

            const sortedTech = Object.entries(techCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);

            const maxCount = Math.max(...Object.values(techCount), 1);
            const breadth = sortedTech.map(([name, count]) => ({
                name,
                percentage: Math.round((count / maxCount) * 100)
            }));
            setTechBreadth(breadth);

        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        } finally {
            setLoading(false);
            setDataLoaded(true);
        }
    }, [days, setDataLoaded]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            fetchDashboardData();
        }
    }, [router, days, fetchDashboardData]);

    if (!isAuthenticated) return null;

    const totalViews = stats?.categoryViews?.reduce((acc, curr) => acc + curr.count, 0) || 0;

    // Format time series for trend
    const trendData = stats?.timeSeries?.reduce<TrendRow[]>((acc, curr) => {
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

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Top Bar / Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#e5e1e4] font-sans">Analytics Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time performance metrics for your architectural ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#09090b] border border-[#27272a] p-1 rounded-xl shadow-sm">
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
                    <Button variant="outline" className="border-[#27272a] bg-[#09090b] hover:bg-[#18181b] flex items-center gap-2 h-10 text-[#e5e1e4]">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Gathering your data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Projects Card */}
                        <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <span className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest">Total Projects</span>
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Folder className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-[#e5e1e4] font-sans">{projectCount}</h3>
                                    <p className="text-emerald-500 text-xs mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> +12%
                                    </p>
                                </div>
                                <svg className="w-24 h-12 overflow-visible">
                                    <polyline fill="none" points="0,40 10,35 20,42 30,20 40,30 50,15 60,25 70,10 80,15 90,5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                                </svg>
                            </div>
                        </div>

                        {/* Work Experience Card */}
                        <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <span className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest">Work Experiences</span>
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-[#e5e1e4] font-sans">{String(workCount).padStart(2, '0')}</h3>
                                    <p className="text-muted-foreground text-xs mt-1">Steady</p>
                                </div>
                                <svg className="w-24 h-12 overflow-visible">
                                    <polyline fill="none" points="0,25 20,25 40,25 60,25 80,25 90,25" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                                </svg>
                            </div>
                        </div>

                        {/* Testimonials Card */}
                        <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <span className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest">Testimonials</span>
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-[#e5e1e4] font-sans">{testimonialCount}</h3>
                                    <p className="text-emerald-500 text-xs mt-1 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> New review
                                    </p>
                                </div>
                                <svg className="w-24 h-12 overflow-visible">
                                    <polyline fill="none" points="0,40 15,30 30,35 45,15 60,20 75,5 90,10" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                                </svg>
                            </div>
                        </div>

                        {/* Profile Views Card */}
                        <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <span className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest">Profile Views</span>
                                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                                    <Eye className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-[#e5e1e4] font-sans">
                                        {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
                                    </h3>
                                    <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                                        <TrendingDown className="w-3.5 h-3.5" /> -2%
                                    </p>
                                </div>
                                <svg className="w-24 h-12 overflow-visible">
                                    <polyline fill="none" points="0,5 20,15 40,10 60,30 80,25 90,45" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Actions Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Traffic Trend Chart */}
                        <div className="lg:col-span-2 bg-[#09090b] border border-[#27272a] p-8 rounded-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-xl font-bold text-[#e5e1e4]">Traffic Trend</h4>
                                    <p className="text-muted-foreground text-sm mt-1">Page visits over the selected range</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs text-muted-foreground">Total Views</span>
                                </div>
                            </div>

                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#71717a' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#71717a' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                                            itemStyle={{ fontSize: '12px', color: '#e5e1e4' }}
                                            labelStyle={{ color: '#71717a', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#3b82f6"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-[#09090b] border border-[#27272a] p-8 rounded-2xl flex flex-col justify-between">
                            <div>
                                <h4 className="text-xl font-bold text-[#e5e1e4] mb-6">Quick Actions</h4>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/admin/projects/add')}
                                        className="w-full p-4 rounded-xl bg-[#18181b]/30 border border-[#27272a] flex items-center justify-between hover:border-primary/50 hover:bg-[#18181b]/50 transition-all duration-200 group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <PlusCircle className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-medium text-[#e5e1e4]">New Project</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => router.push('/admin/resume/add')}
                                        className="w-full p-4 rounded-xl bg-[#18181b]/30 border border-[#27272a] flex items-center justify-between hover:border-primary/50 hover:bg-[#18181b]/50 transition-all duration-200 group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-5 h-5 text-amber-500" />
                                            <span className="text-sm font-medium text-[#e5e1e4]">Log Experience</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        className="w-full p-4 rounded-xl bg-[#18181b]/30 border border-[#27272a] flex items-center justify-between hover:border-primary/50 hover:bg-[#18181b]/50 transition-all duration-200 group text-left opacity-70 hover:opacity-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-5 h-5 text-purple-500" />
                                            <span className="text-sm font-medium text-[#e5e1e4]">Sync LinkedIn</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        className="w-full p-4 rounded-xl bg-[#18181b]/30 border border-[#27272a] flex items-center justify-between hover:border-primary/50 hover:bg-[#18181b]/50 transition-all duration-200 group text-left opacity-70 hover:opacity-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Download className="w-5 h-5 text-rose-500" />
                                            <span className="text-sm font-medium text-[#e5e1e4]">Generate PDF</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Activity & Tech Breadth */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-[#09090b] border border-[#27272a] p-8 rounded-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xl font-bold text-[#e5e1e4]">System Feed</h4>
                                <span className="text-sm text-primary hover:underline cursor-pointer">View All</span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4 relative">
                                    <div className="absolute left-[11px] top-6 bottom-0 w-[1px] bg-[#27272a]"></div>
                                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center z-10 shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#adc6ff]"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#e5e1e4]">Updated &quot;Cloud Architecture Framework&quot; Project</p>
                                        <p className="text-xs text-muted-foreground mt-1">2 hours ago • Project Dashboard</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative">
                                    <div className="absolute left-[11px] top-6 bottom-0 w-[1px] bg-[#27272a]"></div>
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-[#27272a] flex items-center justify-center z-10 shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#e5e1e4]">New Testimonial received from Sarah J.</p>
                                        <p className="text-xs text-muted-foreground mt-1">5 hours ago • Social Proof</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center z-10 shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#ffb786]"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#e5e1e4]">Added &quot;Senior Solutions Architect&quot; role at Vercel</p>
                                        <p className="text-xs text-muted-foreground mt-1">Yesterday • Career Path</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technology Breadth */}
                        <div className="bg-[#09090b] border border-[#27272a] p-8 rounded-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-xl font-bold text-[#e5e1e4]">Technology Breadth</h4>
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </div>

                                <div className="space-y-4">
                                    {techBreadth.length > 0 ? (
                                        techBreadth.map((tech, idx) => {
                                            const colors = ["bg-primary", "bg-amber-500", "bg-purple-500", "bg-rose-500"];
                                            const textColors = ["text-primary", "text-amber-500", "text-purple-500", "text-rose-500"];
                                            const color = colors[idx % colors.length];
                                            const textColor = textColors[idx % textColors.length];

                                            return (
                                                <div key={tech.name}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-[#e5e1e4]">{tech.name}</span>
                                                        <span className={`${textColor} font-mono font-semibold`}>{tech.percentage}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${color} rounded-full transition-all duration-1000`}
                                                            style={{ width: `${tech.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-sm text-muted-foreground py-4">
                                            No tech stack data available yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-[#18181b]/50 rounded-xl border border-[#27272a] flex items-center gap-4">
                                <Lightbulb className="w-8 h-8 text-primary shrink-0" />
                                <p className="text-sm text-[#e5e1e4]">
                                    You&apos;re in the <span className="text-primary font-bold">top 5%</span> of cloud architects in your region this quarter.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
