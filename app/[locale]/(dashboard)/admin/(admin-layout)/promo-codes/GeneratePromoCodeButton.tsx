"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Copy, Check } from "lucide-react";
import { PlanType } from "@prisma/client";
import { generatePromoCode } from "@/actions/admin/promo-codes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GeneratePromoCodeButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [copied, setCopied] = useState(false);

    const [planType, setPlanType] = useState<PlanType>("PRO");
    const [maxUses, setMaxUses] = useState("");
    const [expiryDays, setExpiryDays] = useState("");

    const handleGenerate = async () => {
        setIsPending(true);

        const expiresAt = expiryDays
            ? new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000)
            : undefined;

        const result = await generatePromoCode(
            planType,
            maxUses ? parseInt(maxUses) : undefined,
            expiresAt
        );

        if (result.success && result.code) {
            setGeneratedCode(result.code);
            toast.success("تم إنشاء الكود بنجاح");
            router.refresh();
        } else {
            toast.error("فشل في إنشاء الكود");
        }

        setIsPending(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        toast.success("تم نسخ الكود");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setOpen(false);
        setGeneratedCode("");
        setCopied(false);
        setPlanType("PRO");
        setMaxUses("");
        setExpiryDays("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إنشاء كود جديد
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>إنشاء كود ترويج جديد</DialogTitle>
                    <DialogDescription>
                        حدد تفاصيل الكود الترويجي للترقية إلى خطة مدفوعة
                    </DialogDescription>
                </DialogHeader>

                {generatedCode ? (
                    <div className="space-y-4 py-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">الكود الجديد:</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg text-center">
                                    {generatedCode}
                                </code>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>الخطة المستهدفة</Label>
                            <Select value={planType} onValueChange={(val) => setPlanType(val as PlanType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRO">احترافي (PRO)</SelectItem>
                                    <SelectItem value="BUSINESS">أعمال (BUSINESS)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxUses">الحد الأقصى للاستخدامات (اختياري)</Label>
                            <Input
                                id="maxUses"
                                type="number"
                                min="1"
                                placeholder="غير محدود"
                                value={maxUses}
                                onChange={(e) => setMaxUses(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expiryDays">الصلاحية بالأيام (اختياري)</Label>
                            <Input
                                id="expiryDays"
                                type="number"
                                min="1"
                                placeholder="بدون انتهاء"
                                value={expiryDays}
                                onChange={(e) => setExpiryDays(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {generatedCode ? (
                        <Button onClick={handleClose} className="w-full">
                            إغلاق
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                إلغاء
                            </Button>
                            <Button onClick={handleGenerate} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                إنشاء الكود
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
