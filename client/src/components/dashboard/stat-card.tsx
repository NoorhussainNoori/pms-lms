import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-blue-100",
  trend,
}: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-medium">{value}</p>
        </div>
        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
      {trend && (
        <div className={cn(
          "mt-4 text-xs flex items-center", 
          trend.isPositive ? "text-success" : "text-error"
        )}>
          <span className="material-icons text-sm mr-1">
            {trend.isPositive ? "arrow_upward" : "arrow_downward"}
          </span>
          <span>{trend.value}</span>
        </div>
      )}
    </Card>
  );
}
