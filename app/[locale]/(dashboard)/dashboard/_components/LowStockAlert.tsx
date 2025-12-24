"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import { getLowStockProducts } from "@/actions/advanced-features";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LowStockAlert() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLowStockProducts().then(res => {
            setProducts(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="h-32 animate-pulse bg-muted rounded-xl" />;
    if (products.length === 0) return null;

    return (
        <Card className="border-none shadow-xl shadow-destructive/5 bg-destructive/5 backdrop-blur-xl border-l-4 border-destructive">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alert
                </CardTitle>
                <CardDescription>The following products are below their minimum stock level.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    {products.slice(0, 3).map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-destructive/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-destructive/10 rounded-md">
                                    <Package className="h-4 w-4 text-destructive" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{p.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{p.sku}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-destructive font-black text-sm">{p.totalStock}</span>
                                <span className="text-[10px] text-muted-foreground block">Min: {p.minStock}</span>
                            </div>
                        </div>
                    ))}
                    {products.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">And {products.length - 3} more products...</p>
                    )}
                </div>
                <Button variant="outline" className="w-full border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all gap-2" asChild>
                    <Link href="/dashboard/inventory/products">
                        Manage Inventory <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
