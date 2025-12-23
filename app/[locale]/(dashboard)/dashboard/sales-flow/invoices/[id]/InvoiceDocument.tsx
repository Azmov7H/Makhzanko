"use client";
import { Button } from "@/components/ui/button";
import { Printer, RotateCcw, Smartphone, Mail, MapPin, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface InvoiceData {
    id?: string;
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
    status?: string;
    locale?: string;
    // New settings fields
    settings?: {
        logoUrl?: string;
        primaryColor?: string;
        accentColor?: string;
        fontSize?: "small" | "medium" | "large";
        fontFamily?: string;
        showTax?: boolean;
        showDiscount?: boolean;
        showSeller?: boolean;
        showWarehouse?: boolean;
        showCustomerSection?: boolean;
        showItemCode?: boolean;
    };
    financials?: {
        itemsTotal: number;
        discountAmount: number;
        totalRefunded: number;
        netRevenue: number;
        totalCost: number;
        netProfit: number;
        profitMargin: number;
    };
}

export function InvoiceDocument({ data }: { data: InvoiceData }) {
    const handlePrint = () => {
        window.print();
    };

    const canReturn = data.status !== "REFUNDED" && data.status !== "CANCELLED" && data.id;
    const settings = data.settings || {};

    const fontSizeMap = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base",
    };

    const primaryColor = settings.primaryColor || "#000000";
    const fontFamily = settings.fontFamily || "Inter";
    const fontSizeClass = fontSizeMap[settings.fontSize || "medium"];

    return (
        <>
            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden fixed bottom-6 right-6 flex gap-2 z-50">
                {canReturn && data.locale && (
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="shadow-xl gap-2 bg-white hover:bg-gray-50 border-2"
                    >
                        <Link href={`/${data.locale}/dashboard/sales-flow/returns/new?invoiceId=${data.id}`}>
                            <RotateCcw className="h-5 w-5" />
                            Create Return
                        </Link>
                    </Button>
                )}
                <Button
                    onClick={handlePrint}
                    size="lg"
                    className="shadow-xl gap-2 font-bold"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Printer className="h-5 w-5" />
                    Print Invoice
                </Button>
            </div>

            {/* A4 Invoice Container */}
            <div
                className={`invoice-container mx-auto bg-white shadow-2xl print:shadow-none transition-all ${fontSizeClass}`}
                style={{ fontFamily: fontFamily }}
            >
                {/* Smart Warnings - Hidden in Print */}
                <div className="print:hidden space-y-2 mb-6">
                    {data.items.some(item => (item as any).cost === 0) && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
                            <AlertTriangle className="h-4 w-4" />
                            <strong>Profit Notice:</strong> Some items in this invoice have 0 cost recorded. This will skew profit reports for this sale.
                        </div>
                    )}
                    {data.status === "PARTIAL_REFUND" && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs">
                            <RotateCcw className="h-4 w-4" />
                            <strong>Status:</strong> This invoice has been partially refunded. Some items have been returned to stock.
                        </div>
                    )}
                </div>

                {/* Financial Summary Section (Only when provided) */}
                {data.financials && (
                    <div className="print:hidden mb-8 p-6 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Profit Intelligence</h3>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px]">REAL-TIME</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Net Revenue</p>
                                <p className="text-xl font-black">{data.financials.netRevenue.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{data.currency}</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">COGS (Total Cost)</p>
                                <p className="text-xl font-black">{data.financials.totalCost.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{data.currency}</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Net Profit</p>
                                <p className="text-xl font-black text-emerald-400">{data.financials.netProfit.toLocaleString()} <span className="text-xs text-emerald-600 font-medium">{data.currency}</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Profit Margin</p>
                                <p className="text-xl font-black text-blue-400">{data.financials.profitMargin.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 pb-8 mb-8" style={{ borderColor: primaryColor }}>
                    <div>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} className="h-20 mb-6 object-contain" alt="Logo" />
                        ) : (
                            <div className="h-20 w-20 bg-gray-50 flex items-center justify-center rounded-xl mb-6 text-gray-300 border-2 border-dashed">
                                <span className="text-[10px] text-center px-1 font-bold uppercase tracking-tighter">Makhzanko</span>
                            </div>
                        )}
                        <h1 className="text-5xl font-black tracking-tighter" style={{ color: primaryColor }}>INVOICE</h1>
                        <p className="mt-2 text-xl font-mono font-bold tracking-tight text-gray-600">{data.token}</p>
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">
                            {new Date(data.date).toLocaleDateString(data.locale || 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{data.companyName}</h2>
                        {settings.showSeller !== false && (
                            <div className="mt-4 space-y-1 text-gray-500 font-medium">
                                {data.companyAddress && <p className="flex items-center justify-end gap-2">{data.companyAddress} <MapPin className="h-3.5 w-3.5" /></p>}
                                {data.companyPhone && <p className="flex items-center justify-end gap-2">{data.companyPhone} <Smartphone className="h-3.5 w-3.5" /></p>}
                                {data.companyEmail && <p className="flex items-center justify-end gap-2">{data.companyEmail} <Mail className="h-3.5 w-3.5" /></p>}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <Badge variant={data.status === "COMPLETED" ? "default" : "secondary"} className={`uppercase tracking-widest px-3 py-1 font-bold ${data.status === "COMPLETED" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}>
                                {data.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                {settings.showCustomerSection !== false && data.customerName && (
                    <div className="mb-10 grid grid-cols-2 gap-10">
                        <div className="p-6 bg-gray-50/80 rounded-2xl border-2 border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">Bill To</p>
                            <p className="text-xl font-black text-gray-900">{data.customerName}</p>
                        </div>
                        <div className="flex flex-col justify-end text-right">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Payment Method</p>
                            <p className="font-bold text-gray-700">Cash/Bank Transfer</p>
                        </div>
                    </div>
                )}

                {/* Items Table */}
                <div className="mb-10 min-h-[400px]">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-gray-100/50">
                                <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-l-xl">Description</th>
                                {settings.showItemCode !== false && <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">SKU</th>}
                                <th className="px-5 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Qty</th>
                                <th className="px-5 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Price</th>
                                <th className="px-5 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-r-xl">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.items.map((item, idx) => (
                                <tr key={idx} className="group">
                                    <td className="px-5 py-5 text-gray-900 font-black leading-tight">
                                        {item.name || "Product"}
                                        {(item as any).cost === 0 && (
                                            <span className="print:hidden ml-2 inline-flex items-center text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-tighter">No Cost Recorded</span>
                                        )}
                                    </td>
                                    {settings.showItemCode !== false && (
                                        <td className="px-5 py-5 text-gray-500 font-mono text-[11px] tracking-tight">
                                            {item.sku || "-"}
                                        </td>
                                    )}
                                    <td className="px-5 py-5 text-right font-bold text-gray-700">{item.quantity}</td>
                                    <td className="px-5 py-5 text-right text-gray-500 font-medium whitespace-nowrap">
                                        {Number(item.price).toLocaleString()} <span className="text-[10px]">{data.currency}</span>
                                    </td>
                                    <td className="px-5 py-5 text-right text-gray-900 font-black whitespace-nowrap">
                                        {(item.quantity * item.price).toLocaleString()} <span className="text-[10px]">{data.currency}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-auto pt-8 border-t-2 border-gray-100">
                    <div className="flex justify-end">
                        <div className="w-80 space-y-4">
                            <div className="flex justify-between items-center text-gray-500 font-bold px-2">
                                <span className="uppercase text-[10px] tracking-widest">Subtotal</span>
                                <span>{Number(data.subtotal).toLocaleString()} {data.currency}</span>
                            </div>

                            {data.discountAmount > 0 && settings.showDiscount !== false && (
                                <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Discount
                                        {data.discountType === "percentage" && data.discountValue && ` (${data.discountValue}%)`}
                                    </span>
                                    <span className="font-black">-{Number(data.discountAmount).toLocaleString()} {data.currency}</span>
                                </div>
                            )}

                            <div
                                className="flex justify-between items-center p-5 rounded-2xl text-white shadow-2xl transition-all"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Grand Total</span>
                                <span className="text-2xl font-black">{Number(data.total).toLocaleString()} <span className="text-xs">{data.currency}</span></span>
                            </div>

                            <p className="text-[9px] text-gray-400 text-center italic mt-2">
                                Amount in words: Fully paid in accordance with the transaction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer and Terms */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <div className="flex-1 max-w-md">
                            {data.footerNotes && (
                                <>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms & Notes</p>
                                    <p className="text-xs text-gray-500 leading-relaxed italic pr-10">{data.footerNotes}</p>
                                </>
                            )}
                        </div>
                        <div className="text-center w-40">
                            <div className="h-16 flex items-end justify-center pb-2">
                                {/* Signature Area */}
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Authorized Signature</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-4 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                            <span>Makhzanko ERP</span>
                            <span className="h-1 w-1 bg-gray-200 rounded-full" />
                            <span>Digital Invoice</span>
                            <span className="h-1 w-1 bg-gray-200 rounded-full" />
                            <span>Smart Compliance</span>
                        </div>
                        <p className="text-[8px] text-gray-200">System generated invoice. No signature required if electronically verified.</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
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
                        border: none !important;
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
                        border: 1px solid #f1f1f1;
                    }
                }
            `}</style>
        </>
    );
}

