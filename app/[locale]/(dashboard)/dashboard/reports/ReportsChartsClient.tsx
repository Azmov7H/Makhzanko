"use client";

import dynamic from 'next/dynamic';

const ReportsCharts = dynamic(() => import('./ReportsCharts'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-accent/5 rounded-lg animate-pulse">
            <span className="text-muted-foreground text-sm">جاري تحميل البيانات...</span>
        </div>
    ),
});

interface ReportsChartsClientProps {
    data: any[];
}

export default function ReportsChartsClient({ data }: ReportsChartsClientProps) {
    return <ReportsCharts data={data} />;
}
