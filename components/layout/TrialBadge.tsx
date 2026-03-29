"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TrialBadgeProps {
    daysRemaining: number;
    locale: string;
}

export function TrialBadge({ daysRemaining, locale }: TrialBadgeProps) {
    if (daysRemaining <= 0) {
        return (
            <Link href={`/${locale}/dashboard/settings/billing`}>
                <Badge
                    variant="outline"
                    className="gap-1.5 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer transition-colors"
                >
                    <AlertTriangle className="h-3 w-3" />
                    Trial Expired
                </Badge>
            </Link>
        );
    }

    const isUrgent = daysRemaining <= 3;

    return (
        <Link href={`/${locale}/dashboard/settings/billing`}>
            <Badge
                variant="outline"
                className={cn(
                    "gap-1.5 cursor-pointer transition-colors",
                    isUrgent
                        ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 animate-pulse"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                )}
            >
                {isUrgent ? (
                    <AlertTriangle className="h-3 w-3" />
                ) : (
                    <Sparkles className="h-3 w-3" />
                )}
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left in trial
            </Badge>
        </Link>
    );
}
