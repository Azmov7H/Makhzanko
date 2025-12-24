"use client";

import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Home, Package, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { deleteWarehouseAction } from "@/actions/warehouses";

interface WarehousesClientProps {
    warehouses: any[];
    locale: string;
    t: any;
}

export function WarehousesClient({ warehouses, locale, t }: WarehousesClientProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-8 text-start"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <motion.div variants={item}>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("Warehouses.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
                        {t("Warehouses.description")}
                    </p>
                </motion.div>
                <motion.div variants={item}>
                    <Button asChild className="gap-2 px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        <Link href={`/${locale}/dashboard/inventory/warehouses/new`}>
                            <Plus className="h-5 w-5" />
                            <span className="font-bold">{t("Warehouses.add_warehouse")}</span>
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {warehouses.length === 0 ? (
                <motion.div variants={item} className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-primary/10 bg-card/30 backdrop-blur-sm p-16 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 mb-6">
                        <Home className="h-10 w-10 text-primary opacity-40" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">{t("Warehouses.no_warehouses")}</h3>
                    <p className="text-muted-foreground max-w-xs mb-8 text-lg font-medium leading-relaxed">
                        {t("Warehouses.empty_desc")}
                    </p>
                    <Button asChild className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
                        <Link href={`/${locale}/dashboard/inventory/warehouses/new`}>
                            <Plus className="mr-2 h-5 w-5" /> {t("Warehouses.add_warehouse")}
                        </Link>
                    </Button>
                </motion.div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {warehouses.map((warehouse) => (
                        <motion.div key={warehouse.id} variants={item}>
                            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl group hover:shadow-primary/10 transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col h-full border border-primary/5">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">
                                            {warehouse.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm font-medium">{warehouse.location || t("Warehouses.no_location")}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                        <Home className="h-6 w-6" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 flex-1">
                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-black rounded-xl">
                                                <Package className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{t("Warehouses.items_in_stock_label")}</span>
                                        </div>
                                        <span className="text-2xl font-black text-primary">
                                            {warehouse._count.stocks}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-8 py-6 bg-primary/5 border-t border-primary/5 flex justify-between items-center gap-3">
                                    <Button asChild variant="ghost" size="sm" className="rounded-xl font-bold h-10 hover:bg-primary/10 flex-1">
                                        <Link href={`/${locale}/dashboard/inventory/warehouses/${warehouse.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("Common.edit")}
                                        </Link>
                                    </Button>
                                    <form action={deleteWarehouseAction} className="flex-1">
                                        <input type="hidden" name="id" value={warehouse.id} />
                                        <Button variant="ghost" size="sm" type="submit" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl font-bold h-10">
                                            <Trash2 className="h-4 w-4 mr-2" /> {t("Common.delete")}
                                        </Button>
                                    </form>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
