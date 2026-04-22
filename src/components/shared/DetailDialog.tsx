"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * 详情弹窗组件 - 16:9 横向长方形比例
 * 用于替代独立详情页面，提供统一的弹窗式详情展示
 */

function DetailDialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="detail-dialog" {...props} />;
}

function DetailDialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="detail-dialog-trigger" {...props} />;
}

function DetailDialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="detail-dialog-portal" {...props} />;
}

function DetailDialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="detail-dialog-close" {...props} />;
}

function DetailDialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="detail-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-40 bg-black/40 backdrop-blur-sm",
        "data-[open]:animate-in data-[open]:fade-in-0",
        "data-[closed]:animate-out data-[closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

interface DetailDialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean;
}

function DetailDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DetailDialogContentProps) {
  return (
    <DetailDialogPortal>
      <DetailDialogOverlay />
      <DialogPrimitive.Popup
        data-slot="detail-dialog-content"
        className={cn(
          // 16:9 横向比例弹窗 - 最大宽度 900px，最小高度 500px
          "fixed top-1/2 left-1/2 z-50 grid w-full",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10",
          "outline-none shadow-2xl",
          // 动画
          "data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95",
          "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
          "duration-200",
          // 尺寸 - 16:9 横向比例
          "max-w-[900px] min-h-[500px]",
          // 响应式
          className
        )}
        style={{
          maxWidth: "min(900px, 95vw)",
          maxHeight: "85vh",
        }}
        {...props}
      >
        {/* 关闭按钮 */}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="detail-dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3 z-10"
                size="icon-sm"
              />
            }
          >
            <XIcon className="size-4" />
            <span className="sr-only">关闭</span>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Popup>
    </DetailDialogPortal>
  );
}

interface DetailDialogHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
}

function DetailDialogHeader({ className, title, description, ...props }: DetailDialogHeaderProps) {
  return (
    <div
      data-slot="detail-dialog-header"
      className={cn(
        "px-6 py-4 border-b bg-muted/30",
        className
      )}
      {...props}
    >
      <div className="pr-8">
        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface DetailDialogBodyProps extends React.ComponentProps<"div"> {
  scrollable?: boolean;
}

function DetailDialogBody({ className, children, scrollable = true, ...props }: DetailDialogBodyProps) {
  return (
    <div
      data-slot="detail-dialog-body"
      className={cn(
        "overflow-hidden",
        scrollable ? "overflow-y-auto" : "",
        className
      )}
      {...props}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}

function DetailDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-dialog-footer"
      className={cn(
        "px-6 py-4 border-t bg-muted/30 flex items-center justify-end gap-3",
        className
      )}
      {...props}
    />
  );
}

function DetailDialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="detail-dialog-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DetailDialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="detail-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  DetailDialog,
  DetailDialogClose,
  DetailDialogContent,
  DetailDialogDescription,
  DetailDialogFooter,
  DetailDialogHeader,
  DetailDialogPortal,
  DetailDialogTitle,
  DetailDialogTrigger,
  DetailDialogBody,
};
