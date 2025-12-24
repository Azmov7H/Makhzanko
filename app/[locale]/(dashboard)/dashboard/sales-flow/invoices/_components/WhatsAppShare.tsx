"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { getWhatsAppMessage } from "@/actions/advanced-features";

interface WhatsAppShareProps {
    invoiceId: string;
}

export function WhatsAppShare({ invoiceId }: WhatsAppShareProps) {
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        setLoading(true);
        const res = await getWhatsAppMessage(invoiceId);
        setLoading(false);

        if (res.url) {
            window.open(res.url, "_blank");
        }
    };

    return (
        <Button
            onClick={handleShare}
            disabled={loading}
            variant="outline"
            className="gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
        >
            <MessageCircle className="h-4 w-4" />
            {loading ? "Preparing..." : "Send via WhatsApp"}
        </Button>
    );
}
