"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import {
  Bell, AlertTriangle, FileText, CheckCircle2, Clock,
  XCircle, Send, MailOpen, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  plan_published: <Send className="size-4 text-status-info" />,
  task_started: <Bell className="size-4 text-status-info" />,
  hazard_found: <AlertTriangle className="size-4 text-status-warning" />,
  rectification_submitted: <CheckCircle2 className="size-4 text-status-success" />,
  review_failed: <XCircle className="size-4 text-status-danger" />,
  hazard_closed: <CheckCircle2 className="size-4 text-status-success" />,
  report_submitted: <FileText className="size-4 text-status-info" />,
  report_approved: <CheckCircle2 className="size-4 text-status-success" />,
  report_rejected: <XCircle className="size-4 text-status-danger" />,
  task_overdue: <Clock className="size-4 text-status-danger" />,
  rectification_overdue: <Clock className="size-4 text-status-danger" />,
  major_hazard: <AlertTriangle className="size-4 text-status-danger" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("已全部标记为已读");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <PageHeader title="通知中心" badge={unreadCount} backHref="/workspace" backLabel="返回工作台">
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <MailOpen className="size-3.5" /> 全部已读
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            {notifications.length > 0 ? notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 rounded-md p-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                  !notif.isRead ? "bg-primary/[0.02]" : ""
                }`}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                  )
                }
              >
                <div className="mt-0.5 shrink-0">
                  {iconMap[notif.type] || <Bell className="size-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!notif.isRead ? "font-medium" : ""}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="size-1.5 rounded-full bg-status-danger shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{notif.createdAt}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-12">暂无通知</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
