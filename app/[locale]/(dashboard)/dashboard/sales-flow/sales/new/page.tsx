import { db } from "@/lib/db";
import SalesForm from "./SalesForm";
import { getTenantContext } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function NewSalePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const products = await db.product.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("Sales.new_sale")}</h1>
                <p className="text-muted-foreground mt-1">{t("Sales.new_sale_desc")}</p>
            </div>
            <SalesForm products={products} warehouses={warehouses} />
        </div>
    );
}
