"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportProductsAction } from "@/actions/advanced-features";

export function BulkExportProducts() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        const csv = await exportProductsAction();
        setLoading(false);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="gap-2 h-10 px-4 rounded-xl border-primary/20 hover:bg-primary/5 transition-all"
        >
            <Download className="h-4 w-4" />
            {loading ? "Exporting..." : "Bulk Export CSV"}
        </Button>
    );
}
