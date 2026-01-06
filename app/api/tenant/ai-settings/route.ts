import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const context = await getTenantContext();
        if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const tenant = await (db.tenant as any).findUnique({
            where: { id: context.tenantId },
            select: { aiDialect: true }
        });

        return NextResponse.json({ dialect: tenant?.aiDialect });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
