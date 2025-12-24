"use client";
import { Button } from "@/components/ui/button";
import { Printer, RotateCcw, Smartphone, Mail, MapPin, AlertTriangle, ShieldCheck, Download } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";

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
    const { t } = useI18n();

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
            <div className="print:hidden fixed bottom-10 inset-x-0 flex justify-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="flex bg-card/80 backdrop-blur-2xl p-3 rounded-[2rem] border-2 border-primary/10 shadow-3xl items-center gap-3">
                    {canReturn && data.locale && (
                        <Button
                            asChild
                            variant="ghost"
                            className="h-14 px-8 rounded-2xl gap-3 font-black text-sm hover:bg-primary/5 transition-all"
                        >
                            <Link href={`/${data.locale}/dashboard/sales-flow/returns/new?invoiceId=${data.id}`}>
                                <RotateCcw className="h-5 w-5 text-primary" />
                                {t("Invoices.create_return")}
                            </Link>
                        </Button>
                    )}
                    <div className="w-px h-8 bg-primary/10 mx-2" />
                    <Button
                        onClick={handlePrint}
                        size="lg"
                        className="h-14 px-10 rounded-2xl gap-3 font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Printer className="h-6 w-6" />
                        {t("Invoices.print_invoice")}
                    </Button>
                </div>
            </div>

            {/* A4 Invoice Container */}
            <div
                className={`invoice-container mx-auto bg-white shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] print:shadow-none transition-all rounded-[3rem] overflow-hidden ${fontSizeClass}`}
                style={{ fontFamily: fontFamily }}
            >
                {/* Smart Warnings - Hidden in Print */}
                <div className="print:hidden space-y-3 mb-10">
                    {data.items.some(item => (item as any).cost === 0) && (
                        <div className="flex items-center gap-4 p-5 bg-amber-500/5 border-2 border-amber-500/20 rounded-3xl text-amber-700">
                            <div className="p-2 bg-amber-500/10 rounded-xl">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <strong className="font-black text-sm uppercase tracking-widest block">{t("Invoices.profit_notice")}</strong>
                                <p className="text-xs font-medium opacity-80">{t("Invoices.profit_notice_desc")}</p>
                            </div>
                        </div>
                    )}
                    {data.status === "PARTIAL_REFUND" && (
                        <div className="flex items-center gap-4 p-5 bg-blue-500/5 border-2 border-blue-500/20 rounded-3xl text-blue-700">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <RotateCcw className="h-5 w-5" />
                            </div>
                            <div>
                                <strong className="font-black text-sm uppercase tracking-widest block">{t("Invoices.status_notice")}</strong>
                                <p className="text-xs font-medium opacity-80">{t("Invoices.partial_refund_desc")}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Financial Summary Section (Only when provided) */}
                {data.financials && (
                    <div className="print:hidden mb-12 p-8 bg-slate-950 text-white rounded-[2.5rem] shadow-2xl border-2 border-slate-900 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-1000" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">{t("Invoices.profit_intelligence")}</h3>
                            </div>
                            <Badge className="bg-primary hover:bg-primary/90 text-[10px] font-black tracking-widest px-3 py-1 rounded-full">{t("Invoices.real_time")}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{t("Invoices.net_revenue")}</p>
                                <p className="text-2xl font-black">{data.financials.netRevenue.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{data.currency}</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{t("Invoices.cogs")}</p>
                                <p className="text-2xl font-black">{data.financials.totalCost.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{data.currency}</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{t("Invoices.net_profit")}</p>
                                <p className="text-2xl font-black text-emerald-400">{data.financials.netProfit.toLocaleString()} <span className="text-xs text-emerald-600 font-medium">{data.currency}</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{t("Invoices.profit_margin")}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black text-blue-400">{data.financials.profitMargin.toFixed(1)}%</p>
                                    <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-400 rounded-full"
                                            style={{ width: `${Math.min(data.financials.profitMargin, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start border-b-[3px] pb-10 mb-10" style={{ borderColor: primaryColor }}>
                    <div className="space-y-6">
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} className="h-24 object-contain" alt="Logo" />
                        ) : (
                            <div className="h-24 w-24 bg-gray-50 flex flex-col items-center justify-center rounded-3xl text-gray-300 border-[3px] border-dashed border-gray-200">
                                <ShieldCheck className="h-8 w-8 mb-1 opacity-20" />
                                <span className="text-[10px] text-center px-1 font-black uppercase tracking-tighter opacity-50">Makhzanko</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter" style={{ color: primaryColor }}>{t("Invoices.invoice_title")}</h1>
                            <div className="flex items-center gap-4 mt-3">
                                <p className="text-2xl font-mono font-black tracking-tighter text-gray-800">{data.token}</p>
                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                <p className="text-sm text-gray-400 font-black uppercase tracking-[0.2em]">
                                    {new Date(data.date).toLocaleDateString(data.locale || 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-4">{data.companyName}</h2>
                            {settings.showSeller !== false && (
                                <div className="space-y-2 text-gray-500 font-bold text-sm">
                                    {data.companyAddress && <p className="flex items-center justify-end gap-3">{data.companyAddress} <MapPin className="h-4 w-4 opacity-40" /></p>}
                                    {data.companyPhone && <p className="flex items-center justify-end gap-3">{data.companyPhone} <Smartphone className="h-4 w-4 opacity-40" /></p>}
                                    {data.companyEmail && <p className="flex items-center justify-end gap-3">{data.companyEmail} <Mail className="h-4 w-4 opacity-40" /></p>}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Badge variant={data.status === "COMPLETED" ? "default" : "secondary"} className={`uppercase tracking-[0.2em] px-5 py-2 text-xs font-black rounded-xl shadow-lg ${data.status === "COMPLETED" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "shadow-gray-200"}`}>
                                {data.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                {settings.showCustomerSection !== false && data.customerName && (
                    <div className="mb-12 grid grid-cols-2 gap-12">
                        <div className="p-8 bg-gray-50/50 rounded-[2rem] border-2 border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Mail className="h-24 w-24 -rotate-12" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-4">{t("Invoices.bill_to")}</p>
                            <p className="text-2xl font-black text-gray-900">{data.customerName}</p>
                        </div>
                        <div className="flex flex-col justify-end text-right pr-4">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">{t("Invoices.payment_method")}</p>
                            <p className="font-black text-gray-700 text-lg">Cash/Bank Transfer</p>
                            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                <ShieldCheck className="h-4 w-4" />
                                Secured Transaction
                            </div>
                        </div>
                    </div>
                )}

                {/* Items Table */}
                <div className="mb-12 min-h-[450px]">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] rounded-l-[1.5rem]">{t("Invoices.item_description")}</th>
                                {settings.showItemCode !== false && <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t("Invoices.sku")}</th>}
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t("Invoices.qty")}</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t("Invoices.price")}</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] rounded-r-[1.5rem]">{t("Invoices.total")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.items.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-900 font-black text-base tracking-tight">{item.name || "Product"}</span>
                                            {(item as any).cost === 0 && (
                                                <span className="print:hidden w-fit inline-flex items-center text-[9px] font-black text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/10 uppercase tracking-widest mt-1">
                                                    <AlertTriangle className="h-2 w-2 mr-1" />
                                                    {t("Invoices.no_cost_recorded")}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {settings.showItemCode !== false && (
                                        <td className="px-8 py-6">
                                            <span className="text-gray-500 font-mono text-[11px] font-bold tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                                {item.sku || "-"}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-8 py-6 text-right font-black text-gray-700">{item.quantity}</td>
                                    <td className="px-8 py-6 text-right text-gray-500 font-bold tabular-nums">
                                        {Number(item.price).toLocaleString()} <span className="text-[10px] font-black opacity-40 uppercase ml-1">{data.currency}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-gray-900 font-black text-lg tabular-nums">
                                            {(item.quantity * item.price).toLocaleString()}
                                        </span>
                                        <span className="text-[11px] font-black text-gray-400 uppercase ml-2 tabular-nums">{data.currency}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-auto pt-10 border-t-[3px] border-gray-50">
                    <div className="flex justify-between items-end">
                        <div className="max-w-xs space-y-4">
                            <div className="p-5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">{t("Invoices.amount_in_words")}</p>
                                <p className="text-[10px] font-bold text-gray-600 leading-relaxed italic">{t("Invoices.amount_in_words_desc")}</p>
                            </div>
                            <div className="flex items-center gap-3 px-2 text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
                                <ShieldCheck className="h-4 w-4" />
                                Authenticated by Makhzanko ERP
                            </div>
                        </div>

                        <div className="w-96 space-y-5">
                            <div className="flex justify-between items-center text-gray-500 font-black px-4">
                                <span className="uppercase text-[10px] tracking-[0.3em]">{t("Invoices.subtotal")}</span>
                                <span className="text-xl tabular-nums">{Number(data.subtotal).toLocaleString()} <span className="text-xs font-bold ml-1">{data.currency}</span></span>
                            </div>

                            {data.discountAmount > 0 && settings.showDiscount !== false && (
                                <div className="flex justify-between items-center text-emerald-600 bg-emerald-500/5 px-6 py-3 rounded-2xl border-2 border-emerald-500/10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <TrendingDown className="h-4 w-4" />
                                        {t("Invoices.discount")}
                                        {data.discountType === "percentage" && data.discountValue && ` (${data.discountValue}%)`}
                                    </span>
                                    <span className="font-black text-xl tabular-nums">-{Number(data.discountAmount).toLocaleString()} <span className="text-xs ml-1">{data.currency}</span></span>
                                </div>
                            )}

                            <div
                                className="flex flex-col gap-1 p-8 rounded-[2rem] text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative overflow-hidden group"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Printer className="h-20 w-20" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] mb-2 opacity-60 leading-none">{t("Invoices.grand_total")}</span>
                                <div className="flex items-baseline justify-between relative z-10">
                                    <span className="text-4xl font-black tabular-nums tracking-tighter">
                                        {Number(data.total).toLocaleString()}
                                    </span>
                                    <span className="text-sm font-black uppercase tracking-widest">{data.currency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer and Terms */}
                <div className="mt-20 pt-10 border-t-2 border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 max-w-lg">
                            {data.footerNotes && (
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-gray-400 underline decoration-primary/30 underline-offset-8 uppercase tracking-[0.3em] mb-4">{t("Invoices.terms_notes")}</p>
                                    <div className="p-6 bg-gray-50/30 rounded-[1.5rem] border border-gray-100">
                                        <p className="text-xs text-gray-500 leading-relaxed italic pr-10 whitespace-pre-wrap">{data.footerNotes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-center w-56 pt-8">
                            <div className="h-20 flex items-center justify-center mb-4">
                                {/* Signature Area */}
                                <div className="w-full h-px bg-gray-100 border-dashed border-t border-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">{t("Invoices.authorized_signature")}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Valid without physical stamp</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex flex-col items-center gap-4 py-8 border-t border-gray-50 bg-gray-50/20 rounded-b-[2rem]">
                        <div className="flex items-center gap-6 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                            <span className="hover:text-primary transition-colors cursor-default">Makhzanko ERP</span>
                            <div className="h-1.5 w-1.5 bg-primary/20 rounded-full" />
                            <span className="hover:text-primary transition-colors cursor-default">{t("Invoices.digital_invoice")}</span>
                            <div className="h-1.5 w-1.5 bg-primary/20 rounded-full" />
                            <span className="hover:text-primary transition-colors cursor-default">{t("Invoices.smart_compliance")}</span>
                        </div>
                        <p className="text-[9px] text-gray-300 font-bold max-w-md text-center leading-relaxed">
                            {t("Invoices.system_generated")}
                        </p>
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
                        border-radius: 0 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
                @media screen {
                    .invoice-container {
                        max-width: 210mm;
                        min-height: 297mm;
                        padding: 60px;
                        margin: 40px auto;
                        border: 1px solid #f8f8f8;
                    }
                }
            `}</style>
        </>
    );
}

function TrendingDown(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
        </svg>
    )
}

