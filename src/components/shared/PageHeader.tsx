"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Download, Upload, Plus, Filter, RefreshCw
} from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  badge?: string | number;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, badge, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h1 className="text-base font-semibold tracking-tight flex items-center gap-2">
        {title}
        {badge !== undefined && (
          <span className="text-sm font-medium text-muted-foreground">
            ({typeof badge === 'number' ? `${badge} 条` : badge})
          </span>
        )}
      </h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

interface ListToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  onImport?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  onRefresh?: () => void;
  filterActive?: boolean;
  extra?: ReactNode;
  className?: string;
}

export function ListToolbar({
  searchPlaceholder = "搜索...",
  searchValue,
  onSearchChange,
  onAdd,
  addLabel = "新建",
  onImport,
  onExport,
  onFilter,
  onRefresh,
  filterActive,
  extra,
  className,
}: ListToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="input-search"
        />
      </div>
      <div className="flex items-center gap-1.5">
        {onFilter && (
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="size-3.5" />
            筛选
            {filterActive && (
              <span className="ml-1 size-1.5 rounded-full bg-status-info" />
            )}
          </Button>
        )}
        {onRefresh && (
          <Button variant="outline" size="icon-sm" onClick={onRefresh}>
            <RefreshCw className="size-3.5" />
          </Button>
        )}
        {onImport && (
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="size-3.5" />
            导入
          </Button>
        )}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="size-3.5" />
            导出
          </Button>
        )}
        {extra}
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="size-3.5" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
