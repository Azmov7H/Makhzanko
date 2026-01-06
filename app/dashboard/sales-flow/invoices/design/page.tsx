import { getInvoiceSettingsAction } from "@/actions/invoice-settings";
import InvoiceDesigner from "./InvoiceDesigner";
import { getAuthPayload } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";

export default async function InvoiceDesignPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getI18n(locale as Locale);
    // ✅ جلب المستخدم من JWT
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const settings = await getInvoiceSettingsAction();
    const plan = auth.plan || "FREE";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('Invoices.designer.page_title')}</h1>
                <p className="text-muted-foreground text-sm">{t('Invoices.designer.page_desc')}</p>
            </div>

            <InvoiceDesigner settings={settings} plan={plan} />
        </div>
    );
}
