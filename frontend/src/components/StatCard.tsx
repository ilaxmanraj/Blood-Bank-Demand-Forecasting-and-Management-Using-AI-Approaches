import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-xs font-medium ${
              changeType === 'positive' ? 'text-success' :
              changeType === 'negative' ? 'text-destructive' :
              'text-muted-foreground'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor || 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${iconColor ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
      </div>
    </motion.div>
  );
}
