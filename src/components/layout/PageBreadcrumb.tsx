"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/types";
import { ChevronRight, Home } from "lucide-react";

interface PageBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className="px-6 py-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href="/workspace"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="size-3.5" />
          </Link>
        </BreadcrumbItem>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItem key={`${item.label}-${index}`} className="flex items-center gap-1">
              <BreadcrumbSeparator className="[&>svg]:size-3">
                <ChevronRight />
              </BreadcrumbSeparator>
              {isLast ? (
                <BreadcrumbPage className="text-xs font-medium text-foreground">
                  {item.label}
                </BreadcrumbPage>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
