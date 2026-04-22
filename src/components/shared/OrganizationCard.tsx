"use client";

import type { UserType } from "@/lib/types";

interface OrganizationCardProps {
  org: {
    id: string;
    name: string;
    systemLogo?: string;
    teamType?: UserType;
  };
  onClick?: (orgId: string) => void;
  size?: "sm" | "md";
}

const TYPE_STYLES: Record<UserType, string> = {
  supervisor: "bg-blue-500/10 text-blue-600",
  inspector: "bg-green-500/10 text-green-600",
  enterprise: "bg-amber-500/10 text-amber-600",
};

const SIZE_MAP = {
  sm: { wrapper: "w-20 h-20", logo: "h-[60%]", fallback: "text-lg" },
  md: { wrapper: "w-[120px] h-[120px]", logo: "h-[60%]", fallback: "text-2xl" },
};

export default function OrganizationCard({
  org,
  onClick,
  size = "md",
}: OrganizationCardProps) {
  const styles = SIZE_MAP[size];
  const typeStyle = org.teamType ? TYPE_STYLES[org.teamType] : "bg-muted text-muted-foreground";
  const firstLetter = org.name.charAt(0);

  return (
    <div
      className={`${styles.wrapper} flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer`}
      onClick={() => onClick?.(org.id)}
      title={org.name}
    >
      {/* Logo 区域 */}
      <div className={`${styles.logo} flex items-center justify-center`}>
        {org.systemLogo ? (
          <img
            src={org.systemLogo}
            alt={org.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyle}`}>
            {firstLetter}
          </div>
        )}
      </div>
      {/* 名称区域 */}
      <div className="flex-1 flex items-center justify-center px-1">
        <span className="text-xs text-center truncate w-full px-1">
          {org.name}
        </span>
      </div>
    </div>
  );
}
