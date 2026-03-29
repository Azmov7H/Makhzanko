"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface ResponsiveTableProps {
    headers: { label: React.ReactNode; className?: string }[];
    data: any[];
    renderRow: (item: any) => React.ReactNode;
    renderCard: (item: any) => React.ReactNode;
    keyExtractor: (item: any) => string | number;
    emptyState?: React.ReactNode;
    // Pagination props
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function ResponsiveTable({
    headers,
    data,
    renderRow,
    renderCard,
    keyExtractor,
    emptyState,
    page = 1,
    totalPages = 1,
    onPageChange,
}: ResponsiveTableProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const hasPagination = totalPages > 1;

    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    if (isDesktop) {
        return (
            <div className="space-y-4">
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
                {hasPagination && (
                    <div className="flex items-center justify-between p-4 border-t border-border/50">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange?.(page - 1)}
                                disabled={page <= 1}
                                className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange?.(page + 1)}
                                disabled={page >= totalPages}
                                className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {data.map((item) => (
                <div key={keyExtractor(item)} className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-sm">
                    {renderCard(item)}
                </div>
            ))}
            {hasPagination && (
                <div className="flex items-center justify-between p-2 mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(page - 1)}
                        disabled={page <= 1}
                        className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-30"
                    >
                        Prev
                    </Button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{page} / {totalPages}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange?.(page + 1)}
                        disabled={page >= totalPages}
                        className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-30"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
