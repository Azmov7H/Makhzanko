import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { BarcodeLabel } from "../../_components/BarcodeLabel";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { QrCode, Printer, Package, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProductBarcodePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const context = await getTenantContext();
    const t = await getI18n();
    const locale = await getLocale();

    const product = await prisma.product.findUnique({
        where: { id, tenantId: context.tenantId },
        include: { tenant: true }
    });

    if (!product) return <div className="p-20 text-center font-black italic text-destructive text-2xl">{t("Common.error")}</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 text-start space-y-12 print:p-0 print:m-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative print:hidden">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Inventory.print_barcode")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl flex items-center gap-2">
                        <Package className="h-5 w-5 opacity-40" />
                        {product.name} ({product.sku})
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-2xl shadow-primary/5">
                        <QrCode className="h-10 w-10 text-primary" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-20 bg-card/60 backdrop-blur-3xl rounded-[3rem] shadow-3xl border border-primary/5 relative overflow-hidden group print:bg-white print:shadow-none print:border-none print:p-0 print:m-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700 print:hidden" />

                <div className="relative z-10 scale-150 transform-gpu transition-all duration-700 hover:scale-[1.6] print:scale-100 print:transform-none">
                    <BarcodeLabel
                        name={product.name}
                        sku={product.sku}
                        price={product.price.toString()}
                        currency={product.tenant.currency}
                    />
                </div>

                <div className="mt-24 w-full flex justify-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-primary hover:bg-primary/90 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs group/btn"
                    >
                        <Printer className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                        {t("Inventory.print_barcode")}
                    </button>
                </div>
            </div>
        </div>
    );
}
