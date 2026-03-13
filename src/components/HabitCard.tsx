import { motion } from "framer-motion";
import { Check, Clock, Flame, Trash2, Play, Pause } from "lucide-react";
import { Habit, HabitLog } from "@/hooks/useHabits";
import { useState, useEffect, useRef } from "react";

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  streak: number;
  onToggle: (completed: boolean, timeSpent?: number) => void;
  onUpdateTime: (minutes: number) => void;
  onDelete: () => void;
}

const HabitCard = ({ habit, log, streak, onToggle, onUpdateTime, onDelete }: HabitCardProps) => {
  const completed = log?.completed ?? false;
  const timeSpent = log?.time_spent_minutes ?? 0;
  const progress = Math.min((timeSpent / habit.target_minutes) * 100, 100);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(timeSpent * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimerSeconds(timeSpent * 60);
  }, [timeSpent]);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      // Save accumulated time
      const mins = Math.floor(timerSeconds / 60);
      if (mins !== timeSpent) {
        onUpdateTime(mins);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const formatTarget = (mins: number) => {
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`;
    return `${mins}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`glass-card-hover p-4 ${completed ? "border-success/30 bg-success/5" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Completion toggle */}
        <button
          onClick={() => onToggle(!completed, Math.floor(timerSeconds / 60))}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            completed
              ? "bg-success border-success"
              : "border-muted-foreground/40 hover:border-primary"
          }`}
        >
          {completed && <Check className="w-3.5 h-3.5 text-success-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{habit.icon}</span>
            <h3 className={`font-display font-semibold text-sm ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {habit.name}
            </h3>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <Flame className="w-3.5 h-3.5 animate-streak-fire" />
                {streak}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full mb-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${completed ? "gradient-success" : "gradient-primary"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timerSeconds)} / {formatTarget(habit.target_minutes)}
            </span>

            {/* Timer controls */}
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`p-1 rounded-md transition-colors ${
                timerRunning ? "text-accent bg-accent/10" : "hover:text-primary hover:bg-primary/10"
              }`}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default HabitCard;
