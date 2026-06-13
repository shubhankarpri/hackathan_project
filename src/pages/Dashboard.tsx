import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateWellnessScore, getWellnessCategory, getMoodScore } from "../utils/wellness";
import type { MoodLog } from "../utils/wellness";
import {
    TrendingUp,
    Moon,
    BookOpen,
    Smile,
    Activity,
    Calendar,
    Award
} from "lucide-react";
import { format } from "date-fns";
import { MotivationCard } from "../components/MotivationCard";

const StatCard = ({ title, value, subvalue, icon: Icon, color }: any) => (
    <div className="glass-card p-6 flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
            <Icon className={color.replace("bg-", "text-")} size={28} />
        </div>
        <div>
            <div className="text-muted-foreground text-sm font-medium">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{subvalue}</div>
        </div>
    </div>
);

export const Dashboard = () => {
    const [moodLogs] = useLocalStorage<MoodLog[]>("mood-logs", []);

    const dashboardData = useMemo(() => {
        if (moodLogs.length === 0) return [];
        return [...moodLogs]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7)
            .map(log => ({
                ...log,
                dateFormatted: format(new Date(log.date), "MMM dd"),
                wellness: calculateWellnessScore(log),
                moodScore: getMoodScore(log.mood)
            }));
    }, [moodLogs]);

    const stats = useMemo(() => {
        if (moodLogs.length === 0) return null;
        const latest = moodLogs[0];
        const wellness = calculateWellnessScore(latest);
        const category = getWellnessCategory(wellness);
        const avgStudy = Math.round(moodLogs.reduce((acc, log) => acc + log.studyHours, 0) / moodLogs.length * 10) / 10;
        const avgSleep = Math.round(moodLogs.reduce((acc, log) => acc + log.sleepHours, 0) / moodLogs.length * 10) / 10;
        return { latest, wellness, category, avgStudy, avgSleep };
    }, [moodLogs]);

    if (moodLogs.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-8 rounded-full bg-primary/10 text-primary">
                    <Activity size={80} />
                </div>
                <h2 className="text-3xl font-bold">No Data Yet</h2>
                <p className="text-muted-foreground max-w-md">Start your first wellness check-in to see your progress and AI insights here.</p>
                <a href="/check-in" className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg">Start First Check-in</a>
            </div>
        );
    }

    return (
        <div className="py-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Your Wellness Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Detailed overview of your mental and physical preparation health.</p>
                </div>
                <div className="flex items-center gap-3 glass p-4 rounded-3xl border-primary/20">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Last Check-in</div>
                        <div className="font-bold">{format(new Date(stats?.latest.date || ""), "MMMM dd, HH:mm")}</div>
                    </div>
                </div>
            </div>

            <MotivationCard />

            {/* Main Score Card */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 glass-card p-8 bg-gradient-to-br from-primary to-accent text-white flex flex-col justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-1 opacity-90">Current Wellness Score</h3>
                        <div className="text-7xl font-extrabold mb-4">{stats?.wellness}</div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 w-fit text-sm font-bold backdrop-blur-md">
                            <Award size={18} />
                            {stats?.category.label}
                        </div>
                    </div>
                    <p className="mt-10 opacity-80 z-10 text-sm leading-relaxed">
                        {stats?.wellness && stats.wellness > 80
                            ? "Excellent! You're in a great mental state for studying."
                            : "Remember to take small breaks. Your focus is key."}
                    </p>
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard title="Avg. Study Hours" value={`${stats?.avgStudy}h`} subvalue="Daily average" icon={BookOpen} color="bg-blue-500" />
                    <StatCard title="Avg. Sleep" value={`${stats?.avgSleep}h`} subvalue="Daily average" icon={Moon} color="bg-purple-500" />
                    <StatCard title="Mood Stability" value="Good" subvalue="Low fluctuations" icon={Smile} color="bg-green-500" />
                    <StatCard title="Last Log Energy" value={`${stats?.latest.energyLevel}/10`} subvalue="Recorded today" icon={Activity} color="bg-rose-500" />
                </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="text-primary" /> Wellness & Mood Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboardData}>
                                <defs>
                                    <linearGradient id="colorWellness" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="dateFormatted" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                                <Area type="monotone" dataKey="wellness" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWellness)" strokeWidth={3} name="Wellness Score" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="text-accent" /> Study & Sleep Correlation</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="dateFormatted" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="studyHours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Study Hours" />
                                <Bar dataKey="sleepHours" fill="#a855f7" radius={[4, 4, 0, 0]} name="Sleep Hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};
