import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient?: string;
}

const StatsCard = ({ title, value, subtitle, icon, gradient = "gradient-primary" }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card p-5 relative overflow-hidden"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export default StatsCard;
