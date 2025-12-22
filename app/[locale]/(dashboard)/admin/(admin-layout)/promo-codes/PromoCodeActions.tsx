"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban, Trash2 } from "lucide-react";
import { deactivatePromoCode, deletePromoCode } from "@/actions/admin/promo-codes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PromoCodeActionsProps {
    code: {
        id: string;
        code: string;
        isActive: boolean;
    };
}

export function PromoCodeActions({ code }: PromoCodeActionsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDeactivate = () => {
        if (!confirm(`هل تريد تعطيل الكود ${code.code}?`)) return;

        startTransition(async () => {
            const result = await deactivatePromoCode(code.id);
            if (result.success) {
                toast.success("تم تعطيل الكود");
                router.refresh();
            } else {
                toast.error("فشل في تعطيل الكود");
            }
        });
    };

    const handleDelete = () => {
        if (!confirm(`هل تريد حذف الكود ${code.code} نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

        startTransition(async () => {
            const result = await deletePromoCode(code.id);
            if (result.success) {
                toast.success("تم حذف الكود");
                router.refresh();
            } else {
                toast.error("فشل في حذف الكود");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {code.isActive && (
                    <DropdownMenuItem onClick={handleDeactivate}>
                        <Ban className="mr-2 h-4 w-4" />
                        تعطيل
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
