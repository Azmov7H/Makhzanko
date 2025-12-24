import { Suspense } from "react";
import ActivityLogs from "./ActivityLogs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditLogPage({ searchParams }: { searchParams: { q?: string; type?: string } }) {
  const { q, type } = searchParams;

  return (
    <div className="space-y-8 p-6">
      {/* Header + Filters كما هي */}

      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <ActivityLogs q={q} type={type} />
      </Suspense>
    </div>
  );
}
