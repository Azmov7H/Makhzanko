import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { ChatInterface } from "./ChatInterface";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const context = await getTenantContext();
    const t = await getI18n(locale as Locale);

    // Find active session
    const session = await db.chatSession.findFirst({
        where: {
            tenantId: context.tenantId,
            status: "ACTIVE",
            endsAt: { gt: new Date() }
        },
        include: {
            messages: {
                orderBy: { createdAt: "asc" }
            }
        }
    });

    const tenant = await db.tenant.findUnique({
        where: { id: context.tenantId },
        select: { name: true }
    });

    const title = t("Dashboard.chat.support_title");
    const description = t("Dashboard.chat.support_desc");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-start">
            <Breadcrumbs items={[
                { label: t("Dashboard.nav.dashboard"), href: `/${locale}/dashboard` },
                { label: title }
            ]} />

            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-foreground">{title}</h1>
                <p className="text-muted-foreground text-lg">{description}</p>
            </div>

            <ChatInterface
                initialSessionId={session?.id}
                initialMessages={session?.messages.map(m => ({
                    ...m,
                    sender: m.sender as "OWNER" | "CLIENT",
                    senderName: m.senderName ?? undefined,
                    createdAt: m.createdAt
                }))}
                tenantName={tenant?.name || "Customer"}
                locale={locale}
            />
        </div>
    );
}
