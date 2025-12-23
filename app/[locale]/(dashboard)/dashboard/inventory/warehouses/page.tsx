import { deleteWarehouseAction } from "@/actions/warehouses";
import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";


import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function WarehousesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <Suspense fallback={<WarehousesSkeleton />}>
            <WarehousesContent locale={locale} />
        </Suspense>
    );
}

async function WarehousesContent({ locale }: { locale: string }) {
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" },
        include: { _count: { select: { stocks: true } } }
    });

    return (
        <div className="space-y-6 text-start">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("Warehouses.title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("Warehouses.description")}</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href={`/${locale}/dashboard/inventory/warehouses/new`}>
                        <Plus className="h-4 w-4" /> {t("Warehouses.add_warehouse")}
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {warehouses.map((warehouse) => (
                    <Card key={warehouse.id} className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">
                                {warehouse.name}
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MapPin className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {warehouse.location || t("Warehouses.no_location")}
                            </p>
                            <p className="text-xs font-bold text-primary mt-2 flex items-center gap-1">
                                {t("Warehouses.items_in_stock", { count: warehouse._count.stocks })}
                            </p>
                        </CardContent>
                        <CardFooter className="justify-end border-t border-muted/20 pt-4 mt-2">
                            <form action={deleteWarehouseAction}>
                                <input type="hidden" name="id" value={warehouse.id} />
                                <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> {t("Common.delete")}
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {warehouses.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted/50 p-12 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold">{t("Warehouses.no_warehouses")}</h3>
                    <p className="mb-6 mt-2 text-muted-foreground max-w-xs">
                        {t("Warehouses.empty_desc")}
                    </p>
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/${locale}/dashboard/inventory/warehouses/new`}>
                            <Plus className="mr-2 h-4 w-4" /> {t("Warehouses.add_warehouse")}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

function WarehousesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
