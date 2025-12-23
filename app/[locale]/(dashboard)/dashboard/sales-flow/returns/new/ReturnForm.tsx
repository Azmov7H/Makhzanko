"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createReturnAction, getReturnableItemsAction } from "@/actions/returns";

interface ReturnableItem {
    productId: string;
    productName: string;
    productSku: string;
    originalQuantity: number;
    returnedQuantity: number;
    returnableQuantity: number;
    price: number;
}

interface ReturnFormProps {
    invoiceId: string;
    locale: string;
    currency: string;
}

export default function ReturnForm({ invoiceId, locale, currency }: ReturnFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    const [invoiceData, setInvoiceData] = useState<{
        invoiceToken: string;
        invoiceSubtotal: number;
        invoiceDiscountAmount: number;
        invoiceTotal: number;
        items: ReturnableItem[];
    } | null>(null);

    const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await getReturnableItemsAction(invoiceId);
            if ("error" in result) {
                toast.error(result.error);
                return;
            }
            setInvoiceData({
                ...result,
                invoiceToken: result.invoiceToken || "N/A",
            });
            setIsLoading(false);
        };
        fetchData();
    }, [invoiceId]);

    const toggleItem = (productId: string, maxQty: number) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (newMap.has(productId)) {
                newMap.delete(productId);
            } else {
                newMap.set(productId, maxQty);
            }
            return newMap;
        });
    };

    const updateQuantity = (productId: string, qty: number, maxQty: number) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (qty <= 0) {
                newMap.delete(productId);
            } else {
                newMap.set(productId, Math.min(qty, maxQty));
            }
            return newMap;
        });
    };

    // Calculate refund preview
    const selectedItemsTotal = invoiceData ? Array.from(selectedItems.entries()).reduce((sum, [productId, qty]) => {
        const item = invoiceData.items.find(i => i.productId === productId);
        return sum + (item?.price || 0) * qty;
    }, 0) : 0;

    const proportion = invoiceData && invoiceData.invoiceSubtotal > 0
        ? selectedItemsTotal / invoiceData.invoiceSubtotal
        : 0;
    const discountShare = invoiceData ? invoiceData.invoiceDiscountAmount * proportion : 0;
    const estimatedRefund = selectedItemsTotal - discountShare;

    const handleSubmit = () => {
        if (selectedItems.size === 0) {
            toast.error("Please select items to return");
            return;
        }
        if (!reason.trim()) {
            toast.error("Please provide a return reason");
            return;
        }

        startTransition(async () => {
            const items = Array.from(selectedItems.entries()).map(([productId, quantity]) => ({
                productId,
                quantity,
            }));

            const result = await createReturnAction({
                invoiceId,
                items,
                reason: reason.trim(),
                notes: notes.trim() || undefined,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Return ${result.token} created successfully`);
                router.push(`/${locale}/dashboard/sales-flow/returns`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!invoiceData || invoiceData.items.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                    <p className="text-lg font-medium">No items available for return</p>
                    <p className="text-muted-foreground mt-1">
                        All items from this invoice have already been returned.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Items Selection */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5" />
                        Select Items to Return
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Invoice: <span className="font-mono font-bold">{invoiceData.invoiceToken}</span>
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {invoiceData.items.map((item) => {
                        const isSelected = selectedItems.has(item.productId);
                        const selectedQty = selectedItems.get(item.productId) || 0;

                        return (
                            <div
                                key={item.productId}
                                className={`p-4 border rounded-lg transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleItem(item.productId, item.returnableQuantity)}
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground font-mono">{item.productSku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{item.price.toLocaleString()} {currency}</p>
                                        {item.returnedQuantity > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {item.returnedQuantity} already returned
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="mt-4 flex items-center gap-4 pl-10">
                                        <Label>Return Quantity:</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={item.returnableQuantity}
                                            value={selectedQty}
                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0, item.returnableQuantity)}
                                            className="w-24"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            of {item.returnableQuantity} available
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Return Summary */}
            <Card className="h-fit lg:sticky lg:top-6">
                <CardHeader>
                    <CardTitle>Return Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Return Reason *</Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Customer changed their mind, Defective product..."
                            className="mt-1.5"
                            rows={3}
                        />
                    </div>
                    <div>
                        <Label>Additional Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes..."
                            className="mt-1.5"
                            rows={2}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Items Value</span>
                            <span>{selectedItemsTotal.toLocaleString()} {currency}</span>
                        </div>
                        {discountShare > 0 && (
                            <div className="flex justify-between text-sm text-orange-600">
                                <span>Proportional Discount</span>
                                <span>-{discountShare.toFixed(2)} {currency}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Refund Amount</span>
                            <span className="text-green-600">{estimatedRefund.toFixed(2)} {currency}</span>
                        </div>
                    </div>

                    {discountShare > 0 && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-xs text-orange-700 dark:text-orange-300">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            Refund is reduced proportionally because the original invoice had a discount applied.
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || selectedItems.size === 0 || !reason.trim()}
                        className="w-full gap-2"
                        size="lg"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4" />
                        )}
                        Process Return
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
