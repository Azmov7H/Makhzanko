import { db } from "@/lib/db";
import PurchaseForm from "./PurchaseForm";
import { getAuthPayload } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPurchasePage() {
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const products = await db.product.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { name: "asc" },
    });

    const warehouses = await db.warehouse.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { name: "asc" },
    });

    return <PurchaseForm products={products} warehouses={warehouses} />;
}
