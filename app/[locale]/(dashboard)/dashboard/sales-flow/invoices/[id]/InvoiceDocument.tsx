"use client";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface InvoiceData {
    token: string;
    customerName?: string;
    date: string;
    items: Array<{ name: string; sku: string; quantity: number; price: number }>;
    subtotal: number;
    discountType?: string;
    discountValue?: number;
    discountAmount: number;
    total: number;
    companyName: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    footerNotes?: string;
    currency: string;
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden fixed bottom-6 right-6 flex gap-2 z-50">
                <Button
                    onClick={handlePrint}
                    size="lg"
                    className="shadow-lg gap-2"
                >
                    <Printer className="h-5 w-5" />
                    Print Invoice
                </Button>
            </div>

            {/* A4 Invoice Container */}
            <div className="invoice-container mx-auto bg-white shadow-xl print:shadow-none">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">INVOICE</h1>
                        <p className="mt-2 text-lg font-mono text-primary font-bold">{data.token}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(data.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-900">{data.companyName}</h2>
                        {data.companyAddress && (
                            <p className="text-sm text-gray-600 mt-1">{data.companyAddress}</p>
                        )}
                        {data.companyPhone && (
                            <p className="text-sm text-gray-600">{data.companyPhone}</p>
                        )}
                        {data.companyEmail && (
                            <p className="text-sm text-gray-600">{data.companyEmail}</p>
                        )}
                    </div>
                </div>

                {/* Customer Info */}
                {data.customerName && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Bill To</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{data.customerName}</p>
                    </div>
                )}

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                                <th className="py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                                <th className="py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                                <th className="py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="py-4 text-gray-900 font-medium">{item.name || "Product"}</td>
                                    <td className="py-4 text-gray-500 font-mono text-sm">{item.sku || "-"}</td>
                                    <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                                    <td className="py-4 text-right text-gray-600">
                                        {Number(item.price).toLocaleString()} {data.currency}
                                    </td>
                                    <td className="py-4 text-right text-gray-900 font-semibold">
                                        {(item.quantity * item.price).toLocaleString()} {data.currency}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="border-t-2 border-gray-300 pt-6">
                    <div className="flex justify-end">
                        <div className="w-72 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{Number(data.subtotal).toLocaleString()} {data.currency}</span>
                            </div>

                            {data.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>
                                        Discount
                                        {data.discountType === "percentage" && data.discountValue && (
                                            <span className="text-sm"> ({data.discountValue}%)</span>
                                        )}
                                    </span>
                                    <span>-{Number(data.discountAmount).toLocaleString()} {data.currency}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>{Number(data.total).toLocaleString()} {data.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {data.footerNotes && (
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        <p>{data.footerNotes}</p>
                    </div>
                )}

                {/* Thank You Message */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>Thank you for your business!</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice-container {
                        width: 210mm;
                        min-height: 297mm;
                        padding: 20mm;
                        margin: 0;
                        box-shadow: none !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
                @media screen {
                    .invoice-container {
                        max-width: 210mm;
                        min-height: 297mm;
                        padding: 40px;
                        margin: 20px auto;
                    }
                }
            `}</style>
        </>
    );
}
