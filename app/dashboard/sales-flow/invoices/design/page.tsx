"use client";

import { useEffect, useState } from "react";
import InvoiceDesigner from "./InvoiceDesigner";
import { useI18n } from "@/lib/i18n/context";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceDesignPage() {
    const { t } = useI18n();
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/invoice`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch invoice settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) return <InvoiceDesignSkeleton />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('Invoices.designer.page_title')}</h1>
                <p className="text-muted-foreground text-sm">{t('Invoices.designer.page_desc')}</p>
            </div>

            <InvoiceDesigner settings={settings} />
        </div>
    );
}

function InvoiceDesignSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
    );
}
