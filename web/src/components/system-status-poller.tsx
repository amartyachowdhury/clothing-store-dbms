"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Health = {
  status: string;
  database: string;
};

export function SystemStatusPoller() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = (await res.json()) as Health;
        if (!cancelled) {
          setHealth(data);
        }
      } catch {
        if (!cancelled) {
          setHealth({ status: "error", database: "disconnected" });
        }
      }
    }

    void poll();
    const id = window.setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!health) {
    return (
      <div className="mx-3 mb-3 px-1">
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  const ok = health.status === "ok" && health.database === "connected";

  return (
    <div
      className={cn(
        "mx-3 mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-xs",
        ok
          ? "border-emerald-200/80 bg-emerald-50/80 text-emerald-900"
          : "border-amber-200/80 bg-amber-50/80 text-amber-900",
      )}
      title={`API: ${health.status}, Database: ${health.database}`}
    >
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          ok ? "bg-emerald-500" : "bg-amber-500",
        )}
        aria-hidden
      />
      <span>{ok ? "API & DB online" : "API or DB issue"}</span>
    </div>
  );
}
