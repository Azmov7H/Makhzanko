"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";

export function BulkExportProducts() {
    const [loading, setLoading] = useState(false);
    const { t } = useI18n();

    const handleExport = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/products/export`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Export failed");
            }

            const csv = await res.text();
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(t("Common.success"), {
                className: "rounded-2xl border-none bg-emerald-500 text-white font-black italic shadow-2xl",
            });
        } catch (error: any) {
            toast.error(error.message || t("Common.error"), {
                className: "rounded-2xl border-none bg-destructive text-white font-black italic shadow-2xl",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="gap-2 h-12 px-6 rounded-2xl border-primary/10 hover:bg-primary hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest group shadow-xl shadow-primary/5 hover:shadow-primary/20"
        >
            {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            )}
            {loading ? t("Common.loading") : t("Products.export_csv")}
        </Button>
    );
}
