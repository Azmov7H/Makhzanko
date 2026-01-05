"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { getWhatsAppMessage } from "@/actions/advanced-features";
import { useI18n } from "@/lib/i18n/context";

interface WhatsAppShareProps {
    invoiceId: string;
}

export function WhatsAppShare({ invoiceId }: WhatsAppShareProps) {
    const [loading, setLoading] = useState(false);
    const { t } = useI18n();

    const handleShare = async () => {
        setLoading(true);
        try {
            const res = await getWhatsAppMessage(invoiceId);
            if (res.url) {
                window.open(res.url, "_blank");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleShare}
            disabled={loading}
            variant="ghost"
            className="h-12 px-6 rounded-xl border border-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 transition-all duration-300 group"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            )}
            <span className="font-black text-xs uppercase tracking-widest ml-2">
                {loading ? t("Invoices.preparing") || "..." : t("Invoices.whatsapp_share") || "WhatsApp"}
            </span>
        </Button>
    );
}
