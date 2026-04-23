"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useHydrated } from "@/hooks/useHydrated";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const breadcrumbs = useBreadcrumbs();

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <PageBreadcrumb items={breadcrumbs} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
