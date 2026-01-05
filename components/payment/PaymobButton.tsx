"use client";

import { useState } from "react";
import { initiatePaymobPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used based on package.json

interface PaymobButtonProps {
    invoiceId: string;
    amount: number;
    label?: string;
}

export function PaymobButton({ invoiceId, amount, label = "Pay Now" }: PaymobButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const result = await initiatePaymobPayment(invoiceId, "CARD");

            if (!result.success || !result.iframeUrl) {
                toast.error(result.error || "Failed to start payment");
                return;
            }

            // Redirect to Iframe
            window.location.href = result.iframeUrl;

        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handlePayment} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {label} ({amount.toFixed(2)})
                </>
            )}
        </Button>
    );
}
