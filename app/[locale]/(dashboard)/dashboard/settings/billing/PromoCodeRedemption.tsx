"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { redeemPromoCode } from "@/actions/promo";
import { useRouter } from "next/navigation";

export function PromoCodeRedemption() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleRedeem = () => {
        if (!code.trim()) {
            toast.error("الرجاء إدخال رمز الترويج");
            return;
        }

        startTransition(async () => {
            const result = await redeemPromoCode(code);

            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success(result.message || "تم ترقية خطتك بنجاح!");
                setCode("");
                router.refresh();
            }
        });
    };

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    <CardTitle>لديك كود ترويج؟</CardTitle>
                </div>
                <CardDescription>
                    استخدم كود الترويج للترقية إلى خطة مدفوعة مجاناً
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="promo-code">رمز الترويج</Label>
                    <div className="flex gap-2">
                        <Input
                            id="promo-code"
                            placeholder="XXXX-XXXX-XXXX"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            disabled={isPending}
                            className="font-mono"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRedeem();
                                }
                            }}
                        />
                        <Button
                            onClick={handleRedeem}
                            disabled={isPending || !code.trim()}
                            className="gap-2"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            تفعيل
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    سيتم ترقية خطتك فوراً بعد إدخال كود صالح
                </p>
            </CardContent>
        </Card>
    );
}
