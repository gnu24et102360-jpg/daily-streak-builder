import AppLayout from "@/components/AppLayout";
import StatsCard from "@/components/StatsCard";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import { useHabits } from "@/hooks/useHabits";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, Clock, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { habits, todayLogs, weekLogs, addHabit, toggleLog, updateLogTime, deleteHabit, getStreak } = useHabits();

  const completedToday = todayLogs.filter((l) => l.completed).length;
  const totalTimeToday = todayLogs.reduce((sum, l) => sum + (l.time_spent_minutes ?? 0), 0);
  const hours = Math.floor(totalTimeToday / 60);
  const mins = totalTimeToday % 60;

  // Max streak across all habits
  const maxStreak = habits.reduce((max, h) => {
    const s = getStreak(h.id, weekLogs);
    return s > max ? s : max;
  }, 0);

  const productivityScore = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {greeting()}, <span className="text-gradient">{user?.user_metadata?.username || "Developer"}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Let's keep that streak alive today!</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Completed"
            value={`${completedToday}/${habits.length}`}
            subtitle="tasks today"
            icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />}
            gradient="gradient-primary"
          />
          <StatsCard
            title="Time Spent"
            value={hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
            subtitle="productive time"
            icon={<Clock className="w-5 h-5 text-accent-foreground" />}
            gradient="gradient-streak"
          />
          <StatsCard
            title="Best Streak"
            value={maxStreak}
            subtitle="days in a row"
            icon={<Flame className="w-5 h-5 text-accent-foreground" />}
            gradient="gradient-streak"
          />
          <StatsCard
            title="Score"
            value={`${productivityScore}%`}
            subtitle="productivity"
            icon={<Target className="w-5 h-5 text-success-foreground" />}
            gradient="gradient-success"
          />
        </div>

        {/* Habits */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Today's Habits</h2>
          <AddHabitDialog
            onAdd={(h) => addHabit.mutate(h)}
          />
        </div>

        {habits.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground mb-4">No habits yet. Add your first habit to start tracking!</p>
            <AddHabitDialog onAdd={(h) => addHabit.mutate(h)} />
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const log = todayLogs.find((l) => l.habit_id === habit.id);
              const streak = getStreak(habit.id, weekLogs);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  log={log}
                  streak={streak}
                  onToggle={(completed, timeSpent) =>
                    toggleLog.mutate({ habitId: habit.id, completed, timeSpent })
                  }
                  onUpdateTime={(minutes) =>
                    updateLogTime.mutate({ habitId: habit.id, minutes })
                  }
                  onDelete={() => deleteHabit.mutate(habit.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
