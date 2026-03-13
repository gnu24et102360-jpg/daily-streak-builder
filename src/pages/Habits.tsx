import AppLayout from "@/components/AppLayout";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import { useHabits } from "@/hooks/useHabits";

const Habits = () => {
  const { habits, todayLogs, weekLogs, addHabit, toggleLog, updateLogTime, deleteHabit, getStreak } = useHabits();

  const completed = todayLogs.filter((l) => l.completed);
  const pending = habits.filter((h) => !todayLogs.find((l) => l.habit_id === h.id && l.completed));

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">My Habits</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {completed.length} completed · {pending.length} pending
            </p>
          </div>
          <AddHabitDialog onAdd={(h) => addHabit.mutate(h)} />
        </div>

        {pending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Pending</h2>
            <div className="space-y-3">
              {pending.map((habit) => {
                const log = todayLogs.find((l) => l.habit_id === habit.id);
                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    log={log}
                    streak={getStreak(habit.id, weekLogs)}
                    onToggle={(c, t) => toggleLog.mutate({ habitId: habit.id, completed: c, timeSpent: t })}
                    onUpdateTime={(m) => updateLogTime.mutate({ habitId: habit.id, minutes: m })}
                    onDelete={() => deleteHabit.mutate(habit.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Completed ✓</h2>
            <div className="space-y-3">
              {habits
                .filter((h) => todayLogs.find((l) => l.habit_id === h.id && l.completed))
                .map((habit) => {
                  const log = todayLogs.find((l) => l.habit_id === habit.id);
                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      log={log}
                      streak={getStreak(habit.id, weekLogs)}
                      onToggle={(c, t) => toggleLog.mutate({ habitId: habit.id, completed: c, timeSpent: t })}
                      onUpdateTime={(m) => updateLogTime.mutate({ habitId: habit.id, minutes: m })}
                      onDelete={() => deleteHabit.mutate(habit.id)}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Habits;
