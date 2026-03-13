import AppLayout from "@/components/AppLayout";
import { useHabits } from "@/hooks/useHabits";
import { motion } from "framer-motion";

const BADGES = [
  { name: "First Step", icon: "🌱", desc: "Complete your first habit", check: (completed: number) => completed >= 1 },
  { name: "Getting Started", icon: "⚡", desc: "Complete 5 habits", check: (completed: number) => completed >= 5 },
  { name: "On Fire", icon: "🔥", desc: "Complete 10 habits", check: (completed: number) => completed >= 10 },
  { name: "Consistent", icon: "💪", desc: "Complete 25 habits", check: (completed: number) => completed >= 25 },
  { name: "Habit Machine", icon: "🏆", desc: "Complete 50 habits", check: (completed: number) => completed >= 50 },
  { name: "Coding Champion", icon: "💻", desc: "Complete 100 habits", check: (completed: number) => completed >= 100 },
  { name: "Time Warrior", icon: "⏰", desc: "Log 10 hours total", check: (_: number, mins: number) => mins >= 600 },
  { name: "Marathon", icon: "🏅", desc: "Log 50 hours total", check: (_: number, mins: number) => mins >= 3000 },
];

const Achievements = () => {
  const { weekLogs } = useHabits();

  const totalCompleted = weekLogs.filter((l) => l.completed).length;
  const totalMinutes = weekLogs.reduce((s, l) => s + (l.time_spent_minutes ?? 0), 0);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Achievements</h1>
        <p className="text-muted-foreground text-sm mb-8">Earn badges by staying consistent!</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge, i) => {
            const earned = badge.check(totalCompleted, totalMinutes);
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-5 text-center ${earned ? "border-accent/30 glow-streak" : "opacity-50"}`}
              >
                <span className="text-4xl block mb-2">{badge.icon}</span>
                <h3 className="font-display font-semibold text-sm text-foreground">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
                {earned && (
                  <span className="inline-block mt-2 text-xs text-accent font-medium">✓ Earned</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
