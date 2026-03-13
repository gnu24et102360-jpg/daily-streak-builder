import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import { motion } from "framer-motion";
import { UserCircle, Flame, Clock, CheckCircle2 } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { habits, weekLogs } = useHabits();

  const totalCompleted = weekLogs.filter((l) => l.completed).length;
  const totalMinutes = weekLogs.reduce((s, l) => s + (l.time_spent_minutes ?? 0), 0);
  const hours = Math.floor(totalMinutes / 60);

  const maxStreak = habits.reduce((max, h) => {
    let streak = 0;
    const habitLogs = weekLogs
      .filter((l) => l.habit_id === h.id && l.completed)
      .map((l) => l.log_date)
      .sort()
      .reverse();
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (habitLogs.includes(d.toISOString().split("T")[0])) streak++;
      else if (i > 0) break;
    }
    return streak > max ? streak : max;
  }, 0);

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">
            {user?.user_metadata?.username || "Developer"}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-xl font-display font-bold text-foreground">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xl font-display font-bold text-foreground">{hours}h</p>
            <p className="text-xs text-muted-foreground">Productive</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xl font-display font-bold text-foreground">{maxStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
