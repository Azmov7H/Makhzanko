"use server";

import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { requireOwner } from "@/lib/auth-role";
import { revalidatePath } from "next/cache";

/**
 * Start a new support chat session
 * Sessions last 15 minutes
 */
export async function startChatSessionAction() {
    const context = await getTenantContext();

    // Check if there's already an active session
    const existingSession = await db.chatSession.findFirst({
        where: {
            tenantId: context.tenantId,
            status: "ACTIVE",
            endsAt: { gt: new Date() }
        }
    });

    if (existingSession) {
        return { success: true, sessionId: existingSession.id };
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + 15 * 60 * 1000); // 15 minutes

    const session = await db.chatSession.create({
        data: {
            tenantId: context.tenantId,
            status: "ACTIVE",
            startedAt,
            endsAt,
        }
    });

    return { success: true, sessionId: session.id };
}

/**
 * Send a message in a chat session
 */
export async function sendChatMessageAction(data: {
    sessionId: string;
    content: string;
    sender: "OWNER" | "CLIENT";
    senderName?: string;
}) {
    const context = await getTenantContext();

    const session = await db.chatSession.findUnique({
        where: { id: data.sessionId }
    });

    if (!session) return { error: "Session not found" };

    const now = new Date();
    if (now > session.endsAt || session.status !== "ACTIVE") {
        // Mark as expired if it wasn't already
        if (session.status === "ACTIVE") {
            await db.chatSession.update({
                where: { id: data.sessionId },
                data: { status: "EXPIRED" }
            });
        }
        return { error: "Session has expired" };
    }

    const message = await db.chatMessage.create({
        data: {
            sessionId: data.sessionId,
            sender: data.sender,
            senderName: data.senderName,
            content: data.content,
        }
    });

    revalidatePath(`/dashboard/contact`);
    revalidatePath(`/admin/chats/${data.sessionId}`);

    return { success: true, messageId: message.id };
}

/**
 * Get chat sessions for super admin
 */
export async function getAdminChatSessions() {
    await requireOwner();

    return await db.chatSession.findMany({
        include: {
            tenant: {
                select: {
                    name: true,
                    slug: true
                }
            },
            _count: {
                select: { messages: true }
            }
        },
        orderBy: {
            startedAt: "desc"
        }
    });
}

/**
 * Get messages for a specific session (Admin view)
 */
export async function getChatMessagesAction(sessionId: string) {
    await requireOwner();

    return await db.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" }
    });
}

/**
 * End a chat session manually
 */
export async function endChatSessionAction(sessionId: string) {
    await requireOwner();

    await db.chatSession.update({
        where: { id: sessionId },
        data: {
            status: "ENDED",
            endedAt: new Date()
        }
    });

    revalidatePath(`/admin/support`);
    return { success: true };
}
