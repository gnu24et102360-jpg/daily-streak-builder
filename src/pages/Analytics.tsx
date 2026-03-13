import AppLayout from "@/components/AppLayout";
import { useHabits } from "@/hooks/useHabits";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(250, 80%, 62%)",
  "hsl(200, 85%, 55%)",
  "hsl(25, 95%, 55%)",
  "hsl(142, 70%, 45%)",
  "hsl(330, 70%, 55%)",
];

const Analytics = () => {
  const { habits, todayLogs, weekLogs } = useHabits();

  // Weekly data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = weekLogs.filter((l) => l.log_date === dateStr);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      completed: dayLogs.filter((l) => l.completed).length,
      time: dayLogs.reduce((s, l) => s + (l.time_spent_minutes ?? 0), 0),
    };
  });

  // Habit completion pie
  const completedCount = todayLogs.filter((l) => l.completed).length;
  const pendingCount = habits.length - completedCount;
  const pieData = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: Math.max(pendingCount, 0) },
  ];

  // Per-habit time
  const habitTimeData = habits.map((h) => {
    const totalTime = weekLogs
      .filter((l) => l.habit_id === h.id)
      .reduce((s, l) => s + (l.time_spent_minutes ?? 0), 0);
    return { name: h.name, icon: h.icon, minutes: totalTime };
  }).sort((a, b) => b.minutes - a.minutes);

  const totalWeekTime = weekLogs.reduce((s, l) => s + (l.time_spent_minutes ?? 0), 0);
  const avgDaily = Math.round(totalWeekTime / 7);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Progress Analytics</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">This Week</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {Math.floor(totalWeekTime / 60)}h {totalWeekTime % 60}m
            </p>
            <p className="text-xs text-muted-foreground">total productive time</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Daily Average</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {Math.floor(avgDaily / 60)}h {avgDaily % 60}m
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">today</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly bar chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h2 className="text-sm font-display font-semibold text-foreground mb-4">Weekly Completion</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7Days}>
                <XAxis dataKey="day" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(230, 20%, 11%)",
                    border: "1px solid hsl(230, 15%, 20%)",
                    borderRadius: "8px",
                    color: "hsl(220, 20%, 95%)",
                  }}
                />
                <Bar dataKey="completed" fill="hsl(250, 80%, 62%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h2 className="text-sm font-display font-semibold text-foreground mb-4">Today's Progress</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  <Cell fill="hsl(142, 70%, 45%)" />
                  <Cell fill="hsl(230, 15%, 20%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Completed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted" /> Pending</span>
            </div>
          </motion.div>
        </div>

        {/* Per-habit time */}
        {habitTimeData.length > 0 && (
          <div className="glass-card p-6 mt-6">
            <h2 className="text-sm font-display font-semibold text-foreground mb-4">Time by Habit (This Week)</h2>
            <div className="space-y-3">
              {habitTimeData.map((h, i) => (
                <div key={h.name} className="flex items-center gap-3">
                  <span className="text-lg">{h.icon}</span>
                  <span className="text-sm text-foreground flex-1">{h.name}</span>
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${totalWeekTime > 0 ? (h.minutes / totalWeekTime) * 100 : 0}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {Math.floor(h.minutes / 60)}h {h.minutes % 60}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Analytics;
