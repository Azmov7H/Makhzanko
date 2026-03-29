import { prisma } from "@/lib/prisma";
import SalesForm from "./SalesForm";
import { getTenantContext } from "@/lib/auth";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function NewSalePage() {
    const context = await getTenantContext();
    const t = await getI18n();

    const products = await prisma.product.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    const serializedProducts = products.map(p => ({
        ...p,
        price: Number(p.price),
        cost: Number(p.cost)
    }));

    const warehouses = await prisma.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <div className="space-y-4">
                    <Button asChild variant="ghost" className="group rounded-full pl-2 pr-5 hover:bg-primary/10 transition-all duration-500">
                        <Link href="/dashboard/sales-flow/sales" className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                <ArrowLeft className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest text-primary/70">{t("Common.back")}</span>
                        </Link>
                    </Button>
                    <div className="relative">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic flex items-center gap-4">
                            <ShoppingBag className="h-10 w-10 text-primary animate-bounce-slow" />
                            {t("Sales.new_sale")}
                        </h1>
                        <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                            {t("Sales.new_sale_desc")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[3.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-card/60 backdrop-blur-3xl rounded-[3rem] p-1 shadow-3xl overflow-hidden">
                    <SalesForm products={serializedProducts} warehouses={warehouses} />
                </div>
            </div>
        </div>
    );
}

const styles = `
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite ease-in-out;
}
`;
