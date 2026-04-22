"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/types";

interface PageBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex h-9 items-center border-b bg-background/50 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <BreadcrumbItem key={`${item.label}-${index}`}>
                {/* 第一项加 Home 图标 */}
                {isLast ? (
                  <BreadcrumbPage className="font-medium text-foreground flex items-center gap-1">
                    {isFirst && <Home className="size-3.5" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : item.href ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {isFirst && <Home className="size-3.5" />}
                      {item.label}
                    </Link>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      {isFirst && <Home className="size-3.5" />}
                      {item.label}
                    </span>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
