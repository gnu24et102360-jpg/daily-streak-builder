import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
}

export interface ProfileWithStats {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  total_productive_hours: number | null;
  streak?: number;
  habits_completed?: number;
}

export const useFriends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const friendshipsQuery = useQuery({
    queryKey: ["friendships", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`requester_id.eq.${user!.id},addressee_id.eq.${user!.id}`);
      if (error) throw error;
      return data as Friendship[];
    },
    enabled: !!user,
  });

  const acceptedFriendIds = (friendshipsQuery.data ?? [])
    .filter((f) => f.status === "accepted")
    .map((f) => (f.requester_id === user?.id ? f.addressee_id : f.requester_id));

  const pendingRequests = (friendshipsQuery.data ?? []).filter(
    (f) => f.status === "pending" && f.addressee_id === user?.id
  );

  const friendProfilesQuery = useQuery({
    queryKey: ["friend_profiles", acceptedFriendIds],
    queryFn: async () => {
      if (acceptedFriendIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", acceptedFriendIds);
      if (error) throw error;
      return data as ProfileWithStats[];
    },
    enabled: acceptedFriendIds.length > 0,
  });

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("total_productive_hours", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ProfileWithStats[];
    },
    enabled: !!user,
  });

  const sendRequest = useMutation({
    mutationFn: async (addresseeEmail: string) => {
      // Find user by looking up profiles — we search by username since we can't query auth.users
      const { data: profiles, error: searchErr } = await supabase
        .from("profiles")
        .select("user_id, username")
        .ilike("username", addresseeEmail);
      if (searchErr) throw searchErr;
      if (!profiles || profiles.length === 0) throw new Error("User not found");
      const target = profiles[0];
      if (target.user_id === user!.id) throw new Error("You can't add yourself");

      const { error } = await supabase.from("friendships").insert({
        requester_id: user!.id,
        addressee_id: target.user_id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friendships"] }),
  });

  const respondRequest = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
      const { error } = await supabase
        .from("friendships")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
      queryClient.invalidateQueries({ queryKey: ["friend_profiles"] });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
      queryClient.invalidateQueries({ queryKey: ["friend_profiles"] });
    },
  });

  const getFriendshipId = (friendUserId: string) => {
    return (friendshipsQuery.data ?? []).find(
      (f) =>
        f.status === "accepted" &&
        (f.requester_id === friendUserId || f.addressee_id === friendUserId)
    )?.id;
  };

  return {
    friendships: friendshipsQuery.data ?? [],
    friends: friendProfilesQuery.data ?? [],
    pendingRequests,
    leaderboard: leaderboardQuery.data ?? [],
    sendRequest,
    respondRequest,
    removeFriend,
    getFriendshipId,
    loading: friendshipsQuery.isLoading,
  };
};
