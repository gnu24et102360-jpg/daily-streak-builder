import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Habit = Tables<"habits">;
export type HabitLog = Tables<"habit_logs">;

export const useHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const todayLogsQuery = useQuery({
    queryKey: ["habit_logs", user?.id, new Date().toISOString().split("T")[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user!.id)
        .eq("log_date", today);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const weekLogsQuery = useQuery({
    queryKey: ["habit_logs_week", user?.id],
    queryFn: async () => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("log_date", weekAgo.toISOString().split("T")[0])
        .lte("log_date", today.toISOString().split("T")[0]);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addHabit = useMutation({
    mutationFn: async (habit: Omit<TablesInsert<"habits">, "user_id">) => {
      const { data, error } = await supabase
        .from("habits")
        .insert({ ...habit, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const updateHabit = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Habit>) => {
      const { error } = await supabase.from("habits").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const deleteHabit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("habits").update({ is_active: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const toggleLog = useMutation({
    mutationFn: async ({ habitId, completed, timeSpent }: { habitId: string; completed: boolean; timeSpent?: number }) => {
      const today = new Date().toISOString().split("T")[0];
      const existing = todayLogsQuery.data?.find((l) => l.habit_id === habitId);
      if (existing) {
        const { error } = await supabase
          .from("habit_logs")
          .update({ completed, time_spent_minutes: timeSpent ?? existing.time_spent_minutes })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habit_logs").insert({
          habit_id: habitId,
          user_id: user!.id,
          log_date: today,
          completed,
          time_spent_minutes: timeSpent ?? 0,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_logs"] });
      queryClient.invalidateQueries({ queryKey: ["habit_logs_week"] });
    },
  });

  const updateLogTime = useMutation({
    mutationFn: async ({ habitId, minutes }: { habitId: string; minutes: number }) => {
      const today = new Date().toISOString().split("T")[0];
      const existing = todayLogsQuery.data?.find((l) => l.habit_id === habitId);
      if (existing) {
        const { error } = await supabase
          .from("habit_logs")
          .update({ time_spent_minutes: minutes })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habit_logs").insert({
          habit_id: habitId,
          user_id: user!.id,
          log_date: today,
          time_spent_minutes: minutes,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_logs"] });
      queryClient.invalidateQueries({ queryKey: ["habit_logs_week"] });
    },
  });

  // Calculate streaks
  const getStreak = (habitId: string, logs: HabitLog[] | undefined) => {
    if (!logs) return 0;
    const habitLogs = logs
      .filter((l) => l.habit_id === habitId && l.completed)
      .map((l) => l.log_date)
      .sort()
      .reverse();

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (habitLogs.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  return {
    habits: habitsQuery.data ?? [],
    todayLogs: todayLogsQuery.data ?? [],
    weekLogs: weekLogsQuery.data ?? [],
    loading: habitsQuery.isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleLog,
    updateLogTime,
    getStreak,
  };
};
