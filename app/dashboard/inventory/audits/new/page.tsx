import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import NewAuditForm from "./NewAuditForm";
import { getI18n } from "@/lib/i18n/server";
import { ClipboardCheck } from "lucide-react";

export default async function NewAuditPage() {
    const context = await getTenantContext();
    const t = await getI18n();

    const warehouses = await prisma.warehouse.findMany({
        where: { tenantId: context.tenantId },
        orderBy: { name: "asc" }
    });

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 text-start space-y-12">
            <div className="relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5">
                        <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Inventory.new_audit")}
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg font-medium max-w-2xl">
                    {t("Inventory.manage_audits_desc")}
                </p>
            </div>

            <NewAuditForm warehouses={warehouses} />
        </div>
    );
}
