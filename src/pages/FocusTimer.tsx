import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Flame, Volume2, VolumeX } from "lucide-react";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

const FocusTimer = () => {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [seconds, setSeconds] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            if (mode === "focus") {
              setSessions((p) => p + 1);
              setMode("break");
              return BREAK_MINUTES * 60;
            } else {
              setMode("focus");
              return FOCUS_MINUTES * 60;
            }
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSeconds(mode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSeconds = mode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          {mode === "focus" ? "🔥 Focus Mode" : "☕ Break Time"}
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          {mode === "focus"
            ? "Deep work session — eliminate distractions!"
            : "Take a short break, you've earned it."}
        </p>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128" cy="128" r="116"
              fill="none"
              className="stroke-secondary"
              strokeWidth="8"
            />
            <motion.circle
              cx="128" cy="128" r="116"
              fill="none"
              className={mode === "focus" ? "stroke-primary" : "stroke-success"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 116}
              animate={{ strokeDashoffset: 2 * Math.PI * 116 * (1 - progress / 100) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-foreground tabular-nums">
              {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
              {mode === "focus" ? "Focus" : "Break"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="w-12 h-12 rounded-full border-border"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setRunning(!running)}
            className={`w-16 h-16 rounded-full ${mode === "focus" ? "gradient-primary" : "gradient-success"} text-primary-foreground`}
          >
            {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setMode(mode === "focus" ? "break" : "focus");
              setSeconds(mode === "focus" ? BREAK_MINUTES * 60 : FOCUS_MINUTES * 60);
              setRunning(false);
            }}
            className="w-12 h-12 rounded-full border-border"
          >
            <Flame className="w-5 h-5" />
          </Button>
        </div>

        {/* Sessions */}
        <div className="glass-card p-4 inline-flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Sessions completed:</span>
          <span className="text-xl font-display font-bold text-primary">{sessions}</span>
        </div>
      </div>
    </AppLayout>
  );
};

export default FocusTimer;
