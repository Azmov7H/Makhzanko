import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { NotificationService } from "@/_legacy_backend/services/notifications";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const notifications = await NotificationService.getByTenant(session.tenantId, session.userId);
        const unreadCount = await NotificationService.getUnreadCount(session.tenantId, session.userId);

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { action } = await req.json();

        if (action === "markAllRead") {
            await NotificationService.markAllAsRead(session.tenantId, session.userId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
