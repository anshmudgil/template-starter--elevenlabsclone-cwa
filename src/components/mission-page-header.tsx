"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function MissionPageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0 border-b px-6 py-4", className)}>
      <div className="flex items-start gap-2">
        <SidebarTrigger className="-ml-1 lg:hidden" />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
