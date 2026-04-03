"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvoiceDocument } from "./InvoiceDocument";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n/context";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const { locale } = useI18n();

  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setInvoiceData(data);
            }
        } catch (error) {
            console.error("Failed to fetch invoice:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-1/3" /><Skeleton className="h-[800px] w-full" /></div>;

  if (!invoiceData) {
      // Placeholder data for build stability
      return (
          <div className="min-h-screen bg-gray-50/50 print:bg-white py-12 print:py-0">
             <div className="max-w-4xl mx-auto p-12 text-center text-muted-foreground italic">
                 Invoice not found or still loading...
             </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 print:bg-white py-12 print:py-0">
      <InvoiceDocument data={{ ...invoiceData, locale }} />
    </div>
  );
}
