"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantBg: Record<string, string> = {
  default: "bg-card",
  primary: "bg-primary/5",
  success: "bg-status-success/5",
  warning: "bg-status-warning/5",
  danger: "bg-status-danger/5",
};

const variantIcon: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  primary: "bg-primary/10 text-primary",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger",
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-shadow hover:shadow-md",
        variantBg[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  trend.value >= 0 ? "text-status-success" : "text-status-danger"
                )}
              >
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", variantIcon[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
