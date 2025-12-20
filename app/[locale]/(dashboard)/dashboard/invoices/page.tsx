import { db } from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function InvoicesPage() {
    // ✅ جلب auth من JWT
    const auth = await getAuthPayload();
    if (!auth?.tenantId) redirect("/login");

    const t = await getTranslations("Invoices");
    const tc = await getTranslations("Common");

    const invoices = await db.invoice.findMany({
        where: { tenantId: auth.tenantId },
        include: { sale: true },
        orderBy: { sale: { date: "desc" } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/invoices/new">{t("new_invoice")}</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/invoices/design">{t("create_design")}</Link>
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("invoice_no")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("date")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t("amount")}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t("action")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">{t("no_invoices")}</td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">#{inv.sale.number}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{new Date(inv.sale.date).toLocaleDateString()}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{Number(inv.sale.total).toFixed(2)} {tc("currency")}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right flex gap-2 justify-end">
                                        <Link href={`/dashboard/invoices/${inv.id}`} className="text-black hover:underline">
                                            {t("view")}
                                        </Link>
                                        <Link href={`/dashboard/invoices/design?id=${inv.id}`} className="text-blue-600 hover:underline">
                                            {t("design")}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
