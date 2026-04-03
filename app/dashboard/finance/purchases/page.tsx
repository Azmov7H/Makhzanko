"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, Truck, ShoppingBag, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth/AuthContext";

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, locale } = useI18n();

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPurchases(data);
                }
            } catch (error) {
                console.error("Failed to fetch purchases:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    if (loading) return <PurchasesSkeleton />;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-start pb-20 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Purchases.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">{t("Purchases.description")}</p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                    <Link href="/dashboard/finance/purchases/new">
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                        {t("Purchases.new_po")}
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <Truck className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Purchases.list_title")}</CardTitle>
                            <CardDescription className="text-base font-medium mt-1">{t("Purchases.list_desc")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="h-16 hover:bg-transparent border-primary/5">
                                <TableHead className="px-8 text-xs font-black uppercase tracking-widest w-[160px]">{t("Purchases.date")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Purchases.po_no")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Purchases.supplier")}</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest">{t("Purchases.warehouse")}</TableHead>
                                <TableHead className="text-end text-xs font-black uppercase tracking-widest">{t("Purchases.total")}</TableHead>
                                <TableHead className="px-8 text-end text-xs font-black uppercase tracking-widest w-[140px]">{t("Purchases.status")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-30 animate-pulse">
                                            <ShoppingBag className="h-20 w-20" />
                                            <p className="text-xl font-black italic">{t("Purchases.no_purchases")}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchases.map((po) => (
                                    <TableRow key={po.id} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group/row h-24">
                                        <TableCell className="px-8 font-bold text-sm tracking-tight opacity-70">
                                            {new Date(po.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-black text-lg text-primary bg-primary/5 px-3 py-1 rounded-xl shadow-inner group-hover/row:scale-105 transition-transform inline-block">#{po.number}</span>
                                        </TableCell>
                                        <TableCell className="font-bold text-base">{po.supplierName || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 group/item">
                                                <Warehouse className="h-4 w-4 text-primary opacity-30 group-hover/item:opacity-100 transition-opacity" />
                                                <span className="font-bold text-sm">{po.warehouse?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <span className="font-black text-2xl tracking-tighter text-primary">
                                                {formatCurrency(Number(po.total))}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 text-end">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "font-black text-[10px] tracking-widest uppercase rounded-xl border-none shadow-sm px-3 py-1.5",
                                                    po.status === "RECEIVED" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                                )}
                                            >
                                                {po.status === "RECEIVED" ? t("Purchases.status_received") : t("Purchases.status_pending")}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function PurchasesSkeleton() {
    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20 px-4">
            <div className="flex justify-between items-center bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-primary/5">
                <div className="space-y-3">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-lg opacity-50" />
                </div>
                <Skeleton className="h-14 w-40 rounded-2xl" />
            </div>
            <Skeleton className="h-[600px] w-full rounded-[3rem] shadow-3xl" />
        </div>
    );
}
