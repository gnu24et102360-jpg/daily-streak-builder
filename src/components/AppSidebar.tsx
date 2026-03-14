import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  UserCircle,
  LogOut,
  Flame,
  Timer,
  Trophy,
  Users,
  Crown,
} from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/habits", icon: ListChecks, label: "Habits" },
  { to: "/timer", icon: Timer, label: "Focus Timer" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/achievements", icon: Trophy, label: "Achievements" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/leaderboard", icon: Crown, label: "Leaderboard" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const AppSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 gradient-streak rounded-lg flex items-center justify-center">
          <Flame className="w-6 h-6 text-accent-foreground" />
        </div>
        <span className="text-xl font-display font-bold text-foreground">
          DEV<span className="text-gradient">STREAK</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
