"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Edit2, LogOut } from "lucide-react";
import type { ReactNode } from "react";

type DialogVariant = "danger" | "warning" | "info" | "edit";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  children?: ReactNode;
}

const variantConfig: Record<DialogVariant, {
  icon: typeof AlertTriangle;
  iconClass: string;
  actionClass: string;
}> = {
  danger: {
    icon: Trash2,
    iconClass: "text-destructive",
    actionClass: "bg-destructive hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-status-warning",
    actionClass: "bg-status-warning hover:bg-status-warning/90 text-white",
  },
  info: {
    icon: AlertTriangle,
    iconClass: "text-status-info",
    actionClass: "bg-status-info hover:bg-status-info/90",
  },
  edit: {
    icon: Edit2,
    iconClass: "text-status-info",
    actionClass: "bg-status-info hover:bg-status-info/90",
  },
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "danger",
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className={`size-6 ${config.iconClass}`} />
          </div>
          <AlertDialogTitle asChild>
            <h3 className="text-lg font-semibold">{title}</h3>
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
          {children && (
            <div className="mt-2">{children}</div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full">{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onConfirm();
            }}
            className={config.actionClass}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============ 便捷快捷函数 ============

let globalOpenFn: ((options: Omit<ConfirmDialogProps, "open" | "onOpenChange">) => void) | null = null;

export function openConfirmDialog(options: Omit<ConfirmDialogProps, "open" | "onOpenChange">) {
  if (globalOpenFn) {
    globalOpenFn(options);
  }
}

export function registerConfirmDialog(onOpen: (options: Omit<ConfirmDialogProps, "open" | "onOpenChange">) => void) {
  globalOpenFn = onOpen;
}
