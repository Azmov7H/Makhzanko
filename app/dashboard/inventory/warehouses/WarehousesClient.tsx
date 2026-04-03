"use client";

import { motion } from "framer-motion";
import { Warehouse, Plus, MapPin, Package, MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WarehousesClientProps {
    warehouses: any[];
}

export function WarehousesClient({ warehouses }: WarehousesClientProps) {
    const { t } = useI18n();
    const router = useRouter();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("Common.confirm_delete"))) return;

        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/warehouses/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to delete warehouse");
            }

            toast.success(t("Common.success"));
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-12 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Warehouses.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Warehouses.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                        <Link href="/dashboard/inventory/warehouses/new">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            {t("Warehouses.add_warehouse")}
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {warehouses.map((warehouse) => (
                    <motion.div key={warehouse.id} variants={item}>
                        <Card className="border-none shadow-sm bg-card rounded-[2.5rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-500 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/5 transition-colors" />
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                    <Warehouse className="h-6 w-6" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/10 rounded-2xl transition-all">
                                            <MoreHorizontal className="h-6 w-6 text-muted-foreground/40 group-hover:text-primary" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px] p-2 bg-card border-none rounded-2xl shadow-lg animate-in zoom-in-95 duration-200">
                                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer py-3 transition-all">
                                            <Link href={`/dashboard/inventory/warehouses/${warehouse.id}/edit`} className="flex items-center gap-3">
                                                <div className="p-1.5 bg-primary/5 text-primary rounded-lg"><Edit className="h-4 w-4" /></div>
                                                <span className="font-black text-xs uppercase tracking-widest">{t("Common.edit")}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-all text-destructive"
                                            onClick={() => handleDelete(warehouse.id)}
                                        >
                                            <div className="flex items-center w-full gap-3 font-black text-xs uppercase tracking-widest">
                                                <div className="p-1.5 bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></div>
                                                <span>{t("Common.delete")}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pt-6 relative z-10">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black italic group-hover:text-primary transition-colors">{warehouse.name}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm font-medium">{warehouse.location || t("Warehouses.no_location")}</span>
                                        </div>
                                    </div>

                                    {/* Capacity Progress Bar */}
                                    <div className="space-y-3 pt-6 border-t border-primary/5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <span>{t("Warehouses.stock_level") || "Capacity Used"}</span>
                                            <span className="text-primary">{Math.min(Math.round(((warehouse.stocks?.length || 0) / 100) * 100), 100)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(Math.round(((warehouse.stocks?.length || 0) / 100) * 100), 100)}%` }}
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    (warehouse.stocks?.length || 0) > 80 ? "bg-destructive shadow-lg shadow-destructive/20" : 
                                                    (warehouse.stocks?.length || 0) > 50 ? "bg-amber-500 shadow-lg shadow-amber-500/20" : 
                                                    "bg-primary shadow-lg shadow-primary/20"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black tracking-tighter leading-none">{warehouse.stocks?.length || 0}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("Warehouses.products_count")}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="rounded-xl bg-emerald-500/5 text-emerald-500 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-sm">
                                            {t("Common.active")}
                                        </Badge>
                                    </div>

                                    <Button asChild variant="secondary" className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300 text-primary shadow-sm hover:shadow-primary/20 gap-2">
                                        <Link href={`/dashboard/inventory/warehouses/${warehouse.id}`}>
                                            <Eye className="h-4 w-4" />
                                            {t("Warehouses.view_details")}
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
