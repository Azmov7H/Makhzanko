"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { triggerBackupAction } from "@/actions/admin/backup";
import { toast } from "sonner";
import { Server, Loader2 } from "lucide-react";

export function BackupControls() {
    const [isLoading, setIsLoading] = useState(false);

    const handleBackup = async () => {
        setIsLoading(true);
        try {
            const result = await triggerBackupAction();
            if (result.success) {
                toast.success(`تم بدء عملية النسخ الاحتياطي بنجاح. معرف العملية: ${result.backupId}`);
            }
        } catch (error) {
            toast.error("فشل في بدء عملية النسخ الاحتياطي");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            className="w-full gap-2 font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
            onClick={handleBackup}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Server className="h-4 w-4" />}
            تشغيل نسخة احتياطية الآن
        </Button>
    );
}
