"use client";

import { createInventoryCountAction } from "@/actions/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewAuditForm({ warehouses }: { warehouses: any[] }) {
    const [warehouseId, setWarehouseId] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = () => {
        if (!warehouseId) {
            toast.error("Select a warehouse");
            return;
        }

        startTransition(async () => {
            const result = await createInventoryCountAction(warehouseId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Audit started");
                router.push(`/dashboard/inventory/audits/${result.countId}`);
            }
        });
    };

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Start New Audit</CardTitle>
                <CardDescription>Select a warehouse to begin inventory count.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Warehouse</Label>
                    <Select onValueChange={setWarehouseId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map(w => (
                                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSubmit} disabled={isPending || !warehouseId} className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Count
                </Button>
            </CardContent>
        </Card>
    );
}
