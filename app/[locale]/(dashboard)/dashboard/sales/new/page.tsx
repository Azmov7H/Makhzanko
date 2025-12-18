import { db } from "@/lib/db";
import SalesForm from "./SalesForm";
import { getAuthPayload } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewSalePage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const products = await db.product.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { name: "asc" }
    });

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">New Sale</h1>
            <SalesForm products={products} warehouses={warehouses} />
        </div>
    );
}
