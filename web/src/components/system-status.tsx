import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export function SystemStatusCard({
  health,
}: {
  health: { status: string; database: string };
}) {
  const apiOk = health.status === "ok";
  const dbOk = health.database === "connected";

  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3 text-sm",
        apiOk && dbOk
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-amber-200 bg-amber-50 text-amber-950",
      )}
    >
      <Activity className="h-4 w-4 shrink-0" aria-hidden />
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <StatusPill label="API" ok={apiOk} detail={apiOk ? "Reachable" : "Unreachable"} />
        <StatusPill
          label="Database"
          ok={dbOk}
          detail={dbOk ? "Connected" : "Disconnected"}
        />
      </div>
      {!apiOk || !dbOk ? (
        <p className="w-full text-xs opacity-90">
          Start Postgres and the backend (
          <code className="rounded bg-black/5 px-1">docker compose up -d db backend</code>
          ).
        </p>
      ) : null}
    </div>
  );
}

function StatusPill({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          ok ? "bg-emerald-500" : "bg-amber-500",
        )}
        aria-hidden
      />
      <span className="font-medium">{label}</span>
      <span className="opacity-80">{detail}</span>
    </span>
  );
}
