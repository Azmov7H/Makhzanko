import { createSaleAction } from "@/actions/sales";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SalesForm({ products, warehouses }: { products: any[]; warehouses: any[] }) {
    const [cart, setCart] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || "");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const addToCart = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { productId, quantity: 1, price: Number(product.price), name: product.name, sku: product.sku }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const handleCheckout = () => {
        if (!selectedWarehouse) {
            // Toast here usually
            alert("Please select a warehouse");
            return;
        }
        if (cart.length === 0) return;

        startTransition(async () => {
            const result = await createSaleAction({
                warehouseId: selectedWarehouse,
                items: cart.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.price }))
            });

            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard/sales");
            }
        });
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 h-[calc(100vh-140px)]">
            {/* Product List */}
            <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {products.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product.id)}
                                className="flex flex-col items-start justify-between rounded-lg border bg-white p-3 text-left transition-colors hover:bg-gray-50 hover:border-black focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-950 dark:hover:bg-gray-900"
                            >
                                <div className="w-full">
                                    <span className="font-medium text-sm line-clamp-2 leading-tight">{product.name}</span>
                                    <p className="text-xs text-muted-foreground mt-1">{product.sku}</p>
                                </div>
                                <span className="mt-2 font-bold">${Number(product.price).toFixed(2)}</span>
                            </button>
                        ))}
                        {products.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-10">No products found.</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Cart & Checkout */}
            <Card className="flex flex-col h-full overflow-hidden border-2 border-black/5 dark:border-white/10">
                <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50 pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Current Order</span>
                        <Badge variant="secondary">{cart.length} items</Badge>
                    </CardTitle>
                    <div className="pt-4">
                        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-auto p-0">
                    <ScrollArea className="h-full">
                        <div className="divide-y">
                            {cart.map(item => (
                                <div key={item.productId} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            ${item.price.toFixed(2)} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-sm min-w-[60px] text-right">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(item.productId)}
                                            className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <ShoppingCart className="h-12 w-12 opacity-20 mb-4" />
                                    <p>Cart is empty</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="flex-col border-t bg-gray-50/50 p-6 dark:bg-gray-900/50">
                    <div className="flex w-full justify-between mb-4 text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        disabled={isPending || cart.length === 0 || !selectedWarehouse}
                        className="w-full h-12 text-lg"
                        size="lg"
                    >
                        {isPending ? "Processing..." : (
                            <>
                                <CreditCard className="mr-2 h-5 w-5" /> Complete Sale
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
