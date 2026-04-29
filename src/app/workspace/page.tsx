"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { MOCK_ORGANIZATIONS } from "@/lib/mock-data";
import { useHydrated } from "@/hooks/useHydrated";

export default function WorkspacePage() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    // 查找用户关联的组织
    const userOrgs = MOCK_ORGANIZATIONS.filter(
      (org) => org.orgAdminUserId === currentUser.id || org.creatorId === currentUser.id
    );

    // 已加入组织 → 工作台
    if (userOrgs.length > 0) {
      router.replace(`/team/${userOrgs[0].id}/workspace`);
      return;
    }

    // 未加入任何组织 → 个人中心
    router.replace("/profile");
  }, [hydrated, currentUser, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
