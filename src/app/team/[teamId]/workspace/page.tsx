"use client";

import { useAppStore } from "@/lib/store";
import SupervisorDashboard from "@/components/dashboard/SupervisorDashboard";
import InspectorDashboard from "@/components/dashboard/InspectorDashboard";
import EnterpriseDashboard from "@/components/dashboard/EnterpriseDashboard";

export default function DashboardPage() {
  const { currentUserType } = useAppStore();

  return (
    <div>
      {currentUserType === "inspector" ? <InspectorDashboard /> :
       currentUserType === "enterprise" ? <EnterpriseDashboard /> :
       <SupervisorDashboard />}
    </div>
  );
}
