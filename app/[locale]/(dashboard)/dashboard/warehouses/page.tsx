import { deleteWarehouseAction } from "@/actions/warehouses";
import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";


export default async function WarehousesPage() {
    const context = await getTenantContext();
    const t = await getTranslations("Warehouses");

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" },
        include: { _count: { select: { stocks: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("description")}</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/warehouses/new">
                        <Plus className="mr-2 h-4 w-4" /> {t("add_warehouse")}
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {warehouses.map((warehouse) => (
                    <Card key={warehouse.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {warehouse.name}
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {warehouse.location || t("no_location")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t("items_in_stock", { count: warehouse._count.stocks })}
                            </p>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <form action={deleteWarehouseAction}>
                                <input type="hidden" name="id" value={warehouse.id} />
                                <Button variant="destructive" size="sm" type="submit">
                                    <Trash2 className="h-4 w-4 mr-2" /> {t("delete")}
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
                {warehouses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <MapPin className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">{t("no_warehouses")}</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            {t("empty_desc")}
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/warehouses/new">
                                <Plus className="mr-2 h-4 w-4" /> {t("add_warehouse")}
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
