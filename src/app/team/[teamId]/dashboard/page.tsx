"use client";

import { useAppStore } from "@/lib/store";
import SupervisorDashboard from "@/components/dashboard/SupervisorDashboard";
import InspectorDashboard from "@/components/dashboard/InspectorDashboard";
import EnterpriseDashboard from "@/components/dashboard/EnterpriseDashboard";

export default function DashboardPage() {
  const { currentUserType } = useAppStore();

  if (currentUserType === "inspector") return <InspectorDashboard />;
  if (currentUserType === "enterprise") return <EnterpriseDashboard />;
  return <SupervisorDashboard />;
}
