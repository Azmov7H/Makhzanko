import { db } from "@/lib/db";
import { getTenantContext } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();

    const invoice = await db.invoice.findUnique({
        where: { id, tenantId: context.tenantId },
        include: { tenant: { include: { invoiceSettings: true } } }
    });

    if (!invoice) notFound();

    const data = invoice.jsonSnapshot as any;
    const settings = invoice.tenant.invoiceSettings;

    return (
        <div className="mx-auto max-w-3xl bg-white p-8 shadow-lg my-8 print:shadow-none print:my-0">
            <div className="flex justify-between border-b pb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">INVOICE</h1>
                    <p className="mt-2 text-gray-500">#{data.number}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold">{invoice.tenant.name}</h2>
                    <div className="text-sm text-gray-500 mt-1">
                        {new Date(data.date).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="py-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm font-medium text-gray-500">
                            <th className="py-3">Item</th>
                            <th className="py-3 text-right">Qty</th>
                            <th className="py-3 text-right">Price</th>
                            <th className="py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {data.items.map((item: any) => (
                            <tr key={item.productId}>
                                <td className="py-4">{item.name || "Product"}</td>
                                <td className="py-4 text-right">{item.quantity}</td>
                                <td className="py-4 text-right">${Number(item.price).toFixed(2)}</td>
                                <td className="py-4 text-right font-medium">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t pt-8">
                <div className="flex justify-end text-xl font-bold">
                    <span className="mr-8">Total:</span>
                    <span>${Number(data.total).toFixed(2)}</span>
                </div>
            </div>

            {settings?.footerNotes && (
                <div className="mt-12 text-center text-sm text-gray-500 border-t pt-4">
                    {settings.footerNotes}
                </div>
            )}

            <div className="mt-8 print:hidden flex justify-end gap-4">
                <button
                    className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                    onClick={() => window.print()} // Note: onClick won't work in Server Component directly, need Client wrapper or simple script. 
                // For MVP simplicity, user uses browser print.
                >
                    Print
                </button>
            </div>
            <script dangerouslySetInnerHTML={{
                __html: `
        document.querySelector('button').onclick = () => window.print();
      `}} />
        </div>
    );
}
