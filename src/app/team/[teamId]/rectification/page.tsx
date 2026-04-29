"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { HazardLevelBadge, HazardStatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_HAZARDS } from "@/lib/mock-data";
import { Wrench, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RectificationPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const myHazards = MOCK_HAZARDS.filter((h) =>
    ["notified", "rectifying", "review_failed", "submitted"].includes(h.status)
  );

  const progressMap: Record<string, number> = {
    notified: 20, rectifying: 50, submitted: 80, review_failed: 40,
  };

  return (
    <div className="space-y-4">
      <PageHeader title="隐患整改" badge={myHazards.length} backHref="/workspace" backLabel="返回工作台" />

      <div className="space-y-3">
        {myHazards.length > 0 ? myHazards.map((h) => (
          <Card key={h.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{h.hazardNo}</span>
                    <HazardLevelBadge level={h.level} />
                    <HazardStatusBadge status={h.status} />
                  </div>
                  <p className="text-sm font-medium">{h.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{h.enterpriseName}</span>
                    <span>位置：{h.location}</span>
                    <span className="flex items-center gap-1 text-status-warning font-medium">
                      <Clock className="size-3" /> 截止：{h.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Progress value={progressMap[h.status] || 0} className="flex-1 h-1.5 max-w-[200px]" />
                    <span className="text-xs text-muted-foreground">{progressMap[h.status] || 0}%</span>
                  </div>
                </div>
                <Link href={`/team/${teamId}/hazards/${h.id}`}>
                  <Button variant="outline" size="sm">
                    {h.status === "review_failed" ? "重新整改" : "提交整改"}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Wrench className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">暂无待整改隐患，做得很好！</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
