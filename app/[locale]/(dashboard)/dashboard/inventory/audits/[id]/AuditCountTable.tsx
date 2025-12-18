"use client";

import { updateCountLineAction, finalizeInventoryCountAction } from "@/actions/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function AuditCountTable({ count }: { count: any }) {
    const [isFinalizing, startFinalizing] = useTransition();
    const router = useRouter();

    const handleUpdate = async (lineId: string, qty: number) => {
        // Optimistic update could be done here, but for now just wait
        await updateCountLineAction(lineId, qty);
        toast.success("Saved", { duration: 1000 });
        router.refresh(); // Refresh to update Diff calculation if server logic changed? 
        // Client side diff update is faster.
    };

    const handleFinalize = () => {
        if (!confirm("Are you sure? This will update stock levels.")) return;

        startFinalizing(async () => {
            const result = await finalizeInventoryCountAction(count.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Audit Completed. Stock updated.");
            }
        });
    };

    const isCompleted = count.status === "COMPLETED";

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                {!isCompleted && (
                    <Button onClick={handleFinalize} disabled={isFinalizing} variant="default">
                        {isFinalizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Finalize Audit
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">System Qty</TableHead>
                            <TableHead className="w-[150px] text-right">Counted Qty</TableHead>
                            <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {count.lines.map((line: any) => (
                            <TableRow key={line.id}>
                                <TableCell>{line.product.name} <span className="text-muted-foreground text-xs">({line.product.sku})</span></TableCell>
                                <TableCell className="text-right">{line.systemQty}</TableCell>
                                <TableCell className="text-right">
                                    {isCompleted ? (
                                        <span className="font-bold">{line.countedQty}</span>
                                    ) : (
                                        <Input
                                            type="number"
                                            defaultValue={line.countedQty}
                                            className="w-24 ml-auto text-right"
                                            onBlur={(e) => handleUpdate(line.id, parseInt(e.target.value) || 0)}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className={`text-right font-medium ${line.difference < 0 ? "text-red-500" : line.difference > 0 ? "text-green-500" : ""}`}>
                                    {line.difference > 0 ? "+" : ""}{line.difference}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
