import AppLayout from "@/components/AppLayout";
import { useFriends } from "@/hooks/useFriends";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, UserX, Users, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Friends = () => {
  const { friends, pendingRequests, sendRequest, respondRequest, removeFriend, getFriendshipId } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    if (!searchQuery.trim()) return;
    setSending(true);
    try {
      await sendRequest.mutateAsync(searchQuery.trim());
      toast({ title: "Friend request sent!" });
      setSearchQuery("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Friends
          </h1>
          <p className="text-muted-foreground mt-1">Connect and compete with fellow students</p>
        </motion.div>

        {/* Add Friend */}
        <div className="glass-card p-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Add Friend</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/50 border-border/50"
                onKeyDown={(e) => e.key === "Enter" && handleSendRequest()}
              />
            </div>
            <Button onClick={handleSendRequest} disabled={sending} className="gradient-primary text-primary-foreground">
              <UserPlus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card-hover p-4 flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">Friend request from user</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondRequest.mutate({ id: req.id, status: "accepted" })}
                      className="bg-success/20 text-success hover:bg-success/30"
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => respondRequest.mutate({ id: req.id, status: "rejected" })}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Your Friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No friends yet. Search by username to add friends!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {friends.map((friend) => (
              <motion.div
                key={friend.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-hover p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                  {(friend.username || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground truncate">
                    {friend.username || "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {friend.total_productive_hours ?? 0}h productive
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const fId = getFriendshipId(friend.user_id);
                    if (fId) removeFriend.mutate(fId);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <UserX className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Friends;
