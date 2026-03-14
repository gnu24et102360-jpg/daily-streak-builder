import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Timer, Users, UserCircle } from "lucide-react";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/habits", icon: ListChecks, label: "Habits" },
  { to: "/timer", icon: Timer, label: "Focus" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 z-50 px-2 py-2">
    <div className="flex justify-around">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileNav;
