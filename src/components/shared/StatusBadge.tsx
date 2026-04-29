"use client";

import { cn } from "@/lib/utils";
import type { HazardLevel, HazardStatus, PlanStatus, TaskStatus, ReportStatus, ProjectStatus } from "@/lib/types";
import {
  PLAN_STATUS_MAP, TASK_STATUS_MAP, HAZARD_STATUS_MAP,
  HAZARD_LEVEL_MAP, REPORT_STATUS_MAP, PROJECT_STATUS_MAP,
} from "@/lib/types";

type StatusVariant = "info" | "success" | "warning" | "danger" | "neutral" | "light";

const variantStyles: Record<StatusVariant, string> = {
  info: "bg-status-info/10 text-status-info border-status-info/20",
  success: "bg-status-success/10 text-status-success border-status-success/20",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
  danger: "bg-status-danger/10 text-status-danger border-status-danger/20",
  neutral: "bg-status-neutral/10 text-status-neutral border-status-neutral/20",
  light: "bg-status-light/10 text-status-light border-status-light/20",
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  className?: string;
  dot?: boolean;
}

export default function StatusBadge({ variant, label, className, dot = true }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("size-1.5 rounded-full", {
            "bg-status-info": variant === "info",
            "bg-status-success": variant === "success",
            "bg-status-warning": variant === "warning",
            "bg-status-danger": variant === "danger",
            "bg-status-neutral": variant === "neutral",
            "bg-status-light": variant === "light",
          })}
        />
      )}
      {label}
    </span>
  );
}

// ============ 便捷状态组件 ============

const PLAN_STATUS_VARIANT: Record<PlanStatus, StatusVariant> = {
  draft: "neutral", published: "info", in_progress: "info", completed: "success", archived: "light",
};

const TASK_STATUS_VARIANT: Record<TaskStatus, StatusVariant> = {
  created: "neutral", assigned: "warning", inspecting: "info",
  report_drafting: "info", report_submitted: "warning", report_rejected: "danger",
  under_review: "info", rectifying: "warning", completed: "success", overdue: "danger", cancelled: "light",
};

const HAZARD_STATUS_VARIANT: Record<HazardStatus, StatusVariant> = {
  pending_rectification: "warning",
  rectifying: "info",
  pending_acceptance: "warning",
  accepted: "success",
};

const HAZARD_LEVEL_VARIANT: Record<HazardLevel, StatusVariant> = {
  major: "danger", general: "warning",
};

const REPORT_STATUS_VARIANT: Record<ReportStatus, StatusVariant> = {
  draft: "neutral", submitted: "warning", approved: "success", rejected: "danger",
};

const PROJECT_STATUS_VARIANT: Record<ProjectStatus, StatusVariant> = {
  created: "info", in_progress: "warning", completed: "success", archived: "neutral",
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return <StatusBadge variant={PLAN_STATUS_VARIANT[status]} label={PLAN_STATUS_MAP[status]} />;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <StatusBadge variant={TASK_STATUS_VARIANT[status]} label={TASK_STATUS_MAP[status]} />;
}

export function HazardStatusBadge({ status }: { status: HazardStatus }) {
  return <StatusBadge variant={HAZARD_STATUS_VARIANT[status]} label={HAZARD_STATUS_MAP[status]} />;
}

export function HazardLevelBadge({ level }: { level: HazardLevel }) {
  return <StatusBadge variant={HAZARD_LEVEL_VARIANT[level]} label={HAZARD_LEVEL_MAP[level]} />;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <StatusBadge variant={REPORT_STATUS_VARIANT[status]} label={REPORT_STATUS_MAP[status]} />;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <StatusBadge variant={PROJECT_STATUS_VARIANT[status]} label={PROJECT_STATUS_MAP[status]} />;
}
