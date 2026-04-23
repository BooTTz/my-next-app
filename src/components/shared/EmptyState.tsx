"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  FileX,
  Users,
  Search,
  Bell,
  ClipboardList,
  AlertTriangle,
  FileText,
  Plus,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type EmptyVariant = "default" | "list" | "search" | "notification" | "task" | "hazard" | "report";

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

// 预定义各类型空状态的图标
const variantIcons: Record<EmptyVariant, LucideIcon> = {
  default: Inbox,
  list: FileX,
  search: Search,
  notification: Bell,
  task: ClipboardList,
  hazard: AlertTriangle,
  report: FileText,
};

// 预定义各类型空状态的默认文案
const variantDefaults: Record<EmptyVariant, { title: string; description: string }> = {
  default: {
    title: "暂无数据",
    description: "当前没有相关内容",
  },
  list: {
    title: "暂无记录",
    description: "还没有创建任何记录，请点击下方按钮开始创建",
  },
  search: {
    title: "未找到结果",
    description: "没有找到匹配的内容，请尝试其他关键词",
  },
  notification: {
    title: "暂无通知",
    description: "您还没有收到任何通知消息",
  },
  task: {
    title: "暂无任务",
    description: "当前没有待处理的任务",
  },
  hazard: {
    title: "暂无隐患",
    description: "未发现任何安全隐患记录",
  },
  report: {
    title: "暂无报告",
    description: "还没有生成任何检查报告",
  },
};

export default function EmptyState({
  variant = "default",
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  children,
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];
  const defaults = variantDefaults[variant];
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {/* 图标容器 */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="size-8 text-muted-foreground" />
      </div>

      {/* 标题和描述 */}
      <h3 className="mb-2 text-lg font-medium text-foreground">{displayTitle}</h3>
      {displayDescription && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{displayDescription}</p>
      )}

      {/* 自定义内容 */}
      {children && <div className="mb-6">{children}</div>}

      {/* 操作按钮 */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick}>
              <Plus className="size-4 mr-1.5" />
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ============ 便捷快捷组件 ============

interface ListEmptyProps {
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
}

export function ListEmpty({ onAdd, addLabel = "新建", className }: ListEmptyProps) {
  return (
    <EmptyState
      variant="list"
      title="暂无记录"
      description="还没有创建任何记录，请点击下方按钮开始创建"
      action={onAdd ? { label: addLabel, onClick: onAdd } : undefined}
      className={className}
    />
  );
}

interface SearchEmptyProps {
  keyword?: string;
  onClear?: () => void;
  className?: string;
}

export function SearchEmpty({ keyword, onClear, className }: SearchEmptyProps) {
  return (
    <EmptyState
      variant="search"
      title="未找到结果"
      description={keyword ? `未找到与"${keyword}"相关的结果` : "没有找到匹配的内容"}
      icon={Search}
      action={onClear ? { label: "清除搜索", onClick: onClear } : undefined}
      className={className}
    />
  );
}

interface RefreshEmptyProps {
  onRefresh: () => void;
  className?: string;
}

export function RefreshEmpty({ onRefresh, className }: RefreshEmptyProps) {
  return (
    <EmptyState
      variant="default"
      title="加载失败"
      description="数据加载失败，请重试"
      icon={RefreshCw}
      action={{ label: "重新加载", onClick: onRefresh }}
      className={className}
    />
  );
}
