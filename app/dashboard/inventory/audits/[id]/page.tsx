import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import AuditCountTable from "./AuditCountTable";
import { Badge } from "@/components/ui/badge";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { ClipboardCheck, Calendar, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AuditDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const context = await getTenantContext();
    const t = await getI18n();
    const locale = await getLocale();

    const count = await prisma.inventoryCount.findFirst({
        where: { id, tenantId: context.tenantId },
        include: {
            warehouse: true,
            lines: {
                include: { product: true },
                orderBy: { product: { name: 'asc' } }
            }
        }
    });

    if (!count) return <div className="p-20 text-center font-black italic text-destructive text-2xl">{t("Common.error")}</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-start space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Inventory.audit_details")}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 mt-4 text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary opacity-40" />
                            <span>{count.warehouse.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary opacity-40" />
                            <span>{new Date(count.date).toLocaleDateString("ar-EG", { dateStyle: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary opacity-40" />
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-xl px-4 py-1 font-black text-[10px] uppercase tracking-widest border-none shadow-sm",
                                    count.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                )}
                            >
                                {count.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-2xl shadow-primary/5">
                        <ClipboardCheck className="h-10 w-10 text-primary" />
                    </div>
                </div>
            </div>

            <AuditCountTable count={count} />
        </div>
    );
}
