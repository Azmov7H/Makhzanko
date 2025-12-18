import { getInvoiceSettingsAction } from "@/actions/invoice-settings";
import InvoiceDesigner from "./InvoiceDesigner";
import { getAuthPayload } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InvoiceDesignPage() {
    // ✅ جلب المستخدم من JWT
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const settings = await getInvoiceSettingsAction();
    const plan = auth.plan || "FREE";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Invoice Design</h1>
                <p className="text-muted-foreground text-sm">Customize the appearance of your customer invoices.</p>
            </div>

            <InvoiceDesigner settings={settings} plan={plan} />
        </div>
    );
}
