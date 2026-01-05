import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth";
import { ChatInterface } from "./ChatInterface";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ContactPage() {
    const locale = await getLocale();
    const t = await getI18n(locale);

    const title = t("Dashboard.chat.support_title");
    const description = t("Dashboard.chat.support_desc");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-start">
            <Breadcrumbs items={[
                { label: t("Dashboard.nav.dashboard"), href: "/dashboard" },
                { label: title }
            ]} />

            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-foreground italic">{title}</h1>
                <p className="text-muted-foreground text-lg font-medium">{description}</p>
            </div>

            <Suspense fallback={<ContactSkeleton />}>
                <ChatSection />
            </Suspense>
        </div>
    );
}

async function ChatSection() {
    const context = await getTenantContext();
    const locale = await getLocale();

    // Find active session
    const session = await prisma.chatSession.findFirst({
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

    const tenant = await prisma.tenant.findUnique({
        where: { id: context.tenantId },
        select: { name: true }
    });

    return (
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
    );
}

function ContactSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-[500px] w-full rounded-2xl shadow-xl shadow-primary/5" />
        </div>
    );
}
