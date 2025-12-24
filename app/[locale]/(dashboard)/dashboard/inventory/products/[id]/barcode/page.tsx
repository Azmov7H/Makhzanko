import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { BarcodeLabel } from "../../_components/BarcodeLabel";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function ProductBarcodePage({
    params,
}: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const { id, locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    const product = await db.product.findUnique({
        where: { id, tenantId: context.tenantId },
        include: { tenant: true }
    });

    if (!product) return <div className="p-12 text-center text-destructive">Product not found</div>;

    return (
        <div className="space-y-6 text-start print:space-y-0">
            <div className="flex flex-col gap-1 print:hidden">
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Print Barcode Label
                </h1>
                <p className="text-muted-foreground">Generate a scannable label for {product.name}.</p>
            </div>

            <BarcodeLabel
                name={product.name}
                sku={product.sku}
                price={product.price.toString()}
                currency={product.tenant.currency}
            />
        </div>
    );
}
