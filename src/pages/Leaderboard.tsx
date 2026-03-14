import AppLayout from "@/components/AppLayout";
import { useFriends } from "@/hooks/useFriends";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Clock, Flame } from "lucide-react";

const rankColors = [
  "gradient-streak",   // 1st - gold/orange
  "gradient-primary",  // 2nd - purple
  "gradient-success",  // 3rd - green
];

const Leaderboard = () => {
  const { leaderboard } = useFriends();
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">Top students ranked by productive hours</p>
        </motion.div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[1, 0, 2].map((idx) => {
              const entry = leaderboard[idx];
              if (!entry) return null;
              const rank = idx + 1;
              const isFirst = rank === 1;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`glass-card p-4 text-center ${isFirst ? "row-span-1 -mt-4" : ""} ${
                    entry.user_id === user?.id ? "border-primary/40" : ""
                  }`}
                >
                  <div className={`w-12 h-12 ${rankColors[idx] || "gradient-primary"} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    {rank === 1 ? (
                      <Crown className="w-6 h-6 text-accent-foreground" />
                    ) : (
                      <Medal className="w-6 h-6 text-primary-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">#{rank}</p>
                  <p className="font-display font-bold text-foreground text-sm truncate">
                    {entry.username || "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {entry.total_productive_hours ?? 0}h
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full Rankings */}
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_auto] gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Rank</span>
            <span>Student</span>
            <span>Hours</span>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No data yet. Complete habits to appear on the leaderboard!
            </div>
          ) : (
            leaderboard.map((entry, i) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-[3rem_1fr_auto] gap-4 px-4 py-3 items-center border-b border-border/20 last:border-0 transition-colors ${
                  entry.user_id === user?.id
                    ? "bg-primary/10"
                    : "hover:bg-secondary/50"
                }`}
              >
                <span className={`font-display font-bold text-sm ${i < 3 ? "text-accent" : "text-muted-foreground"}`}>
                  #{i + 1}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">
                    {(entry.username || "?")[0].toUpperCase()}
                  </div>
                  <span className="font-display font-medium text-foreground text-sm truncate">
                    {entry.username || "Student"}
                    {entry.user_id === user?.id && (
                      <span className="text-xs text-primary ml-2">(You)</span>
                    )}
                  </span>
                </div>
                <span className="text-sm font-display font-semibold text-foreground flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-accent" />
                  {entry.total_productive_hours ?? 0}h
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
