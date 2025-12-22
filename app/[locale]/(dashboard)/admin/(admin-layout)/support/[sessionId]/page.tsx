import { getChatMessagesAction } from "@/actions/chat";
import { requireOwner } from "@/lib/auth-role";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminChatInterface } from "../AdminChatInterface";

export default async function AdminSessionPage({
    params,
}: {
    params: Promise<{ locale: string; sessionId: string }>;
}) {
    const { locale, sessionId } = await params;
    await requireOwner();

    // Fetch session details to get tenant name
    const session = await db.chatSession.findUnique({
        where: { id: sessionId },
        include: {
            tenant: {
                select: { name: true }
            }
        }
    });

    if (!session) notFound();

    const initialMessages = await getChatMessagesAction(sessionId);

    return (
        <div className="p-6">
            <AdminChatInterface
                sessionId={sessionId}
                initialMessages={initialMessages.map(m => ({
                    ...m,
                    sender: m.sender as "OWNER" | "CLIENT",
                    senderName: m.senderName ?? undefined,
                    createdAt: new Date(m.createdAt)
                }))}
                tenantName={session.tenant.name}
                locale={locale}
                status={session.status}
            />
        </div>
    );
}
