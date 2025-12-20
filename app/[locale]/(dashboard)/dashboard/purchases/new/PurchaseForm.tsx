"use client"
import { createPurchaseAction } from "@/actions/purchases";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
    id: string;
    name: string;
    sku: string;
    cost: any;
}

interface Warehouse {
    id: string;
    name: string;
}

interface PurchaseItem {
    productId: string;
    name: string;
    quantity: number;
    cost: number;
}

export default function PurchaseForm({ products, warehouses }: { products: Product[], warehouses: Warehouse[] }) {
    const [state, action, isPending] = useActionState(createPurchaseAction, null);
    const [items, setItems] = useState<PurchaseItem[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [cost, setCost] = useState<number>(0);

    const handleAddStart = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        setItems([...items, {
            productId: product.id,
            name: product.name,
            quantity: Number(quantity),
            cost: Number(cost)
        }]);

        // Reset
        setSelectedProduct("");
        setQuantity(1);
        setCost(0);
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const total = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>New Purchase Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        {state?.error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {state.error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Warehouse</Label>
                                <Select name="warehouseId" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Supplier</Label>
                                <Input name="supplier" placeholder="Supplier Name" />
                            </div>
                        </div>

                        <div className="border-t border-b py-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Add Items</h3>
                            </div>
                            <div className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-5 space-y-2">
                                    <Label>Product</Label>
                                    <Select
                                        value={selectedProduct}
                                        onValueChange={(val) => {
                                            setSelectedProduct(val);
                                            const p = products.find(x => x.id === val);
                                            if (p) setCost(Number(p.cost));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Product..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Cost</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={cost}
                                        onChange={e => setCost(Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Qty</Label>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddStart}
                                        disabled={!selectedProduct}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Cost</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">${(item.cost * item.quantity).toFixed(2)}</TableCell>
                                            <TableCell className="text-center">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700 h-8 w-8">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No items added.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end gap-6 text-lg font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <input type="hidden" name="items" value={JSON.stringify(items)} />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/purchases">Cancel</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || items.length === 0}
                            >
                                {isPending ? "Creating PO..." : "Create Purchase Order"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
