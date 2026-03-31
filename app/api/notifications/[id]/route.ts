import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { NotificationService } from "@/_legacy_backend/services/notifications";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await NotificationService.markAsRead(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await NotificationService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
