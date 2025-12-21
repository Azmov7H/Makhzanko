"use client";

import dynamic from 'next/dynamic';
import { useI18n } from "@/lib/i18n/context";

const ReportsCharts = dynamic(() => import('./ReportsCharts'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-accent/5 rounded-xl border border-dashed animate-pulse">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-muted-foreground text-xs font-medium">Loading analytics...</span>
            </div>
        </div>
    ),
});

interface ReportsChartsClientProps {
    data: any[];
}

export default function ReportsChartsClient({ data }: ReportsChartsClientProps) {
    const { t } = useI18n();

    return (
        <ReportsCharts
            data={data}
            label={t("Dashboard.total_sales")}
            currency={t("Common.currency")}
        />
    );
}
