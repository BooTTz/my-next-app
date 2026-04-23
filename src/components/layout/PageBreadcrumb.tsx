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

            return (
              <BreadcrumbItem key={`${item.label}-${index}`}>
                {isLast ? (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : item.href ? (
                  <>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">
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
