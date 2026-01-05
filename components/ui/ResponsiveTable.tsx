"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
    headers: { label: React.ReactNode; className?: string }[];
    data: any[];
    renderRow: (item: any) => React.ReactNode;
    renderCard: (item: any) => React.ReactNode;
    keyExtractor: (item: any) => string | number;
    emptyState?: React.ReactNode;
}

export function ResponsiveTable({
    headers,
    data,
    renderRow,
    renderCard,
    keyExtractor,
    emptyState,
}: ResponsiveTableProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    if (isDesktop) {
        return (
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="h-16 hover:bg-transparent border-primary/5">
                        {headers.map((header, i) => (
                            <TableHead key={i} className={cn("text-xs font-black uppercase tracking-widest", header.className)}>
                                {header.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => renderRow(item))}
                </TableBody>
            </Table>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {data.map((item) => (
                <div key={keyExtractor(item)} className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-sm">
                    {renderCard(item)}
                </div>
            ))}
        </div>
    );
}
