"use client";

import { useAppStore } from "@/lib/store";
import SupervisorDashboard from "@/components/dashboard/SupervisorDashboard";
import InspectorDashboard from "@/components/dashboard/InspectorDashboard";
import EnterpriseDashboard from "@/components/dashboard/EnterpriseDashboard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { currentUserType } = useAppStore();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/team/${teamId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          返回团队详情
        </Link>
      </div>
      {currentUserType === "inspector" ? <InspectorDashboard /> :
       currentUserType === "enterprise" ? <EnterpriseDashboard /> :
       <SupervisorDashboard />}
    </div>
  );
}
