"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import { TopBarActions } from "@/components/layout/TopBar";
import { useHydrated } from "@/hooks/useHydrated";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
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
        {/* 顶部区域：左侧面包屑 + 右侧操作按钮 */}
        <header className="flex h-12 items-center justify-between border-b bg-card px-4">
          <PageBreadcrumb items={breadcrumbs} />
          <TopBarActions />
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
