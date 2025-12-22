"use client";

import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ownerLoginAction } from "@/actions/admin/auth";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await ownerLoginAction(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("تم تسجيل الدخول بنجاح");
                router.push(`/${locale}/admin`);
                router.refresh();
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden relative">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card className="border-none shadow-2xl bg-card/70 backdrop-blur-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />

                    <CardHeader className="space-y-4 pb-8 text-center">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
                        >
                            <Shield className="h-8 w-8 text-primary-foreground" />
                        </motion.div>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-black tracking-tight">لوحة المدير</CardTitle>
                            <CardDescription className="text-base">
                                سجل دخولك للوصول إلى لوحة التحكم الإدارية
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-bold">
                                    اسم المستخدم
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    disabled={isPending}
                                    placeholder="أدخل اسم المستخدم"
                                    className="h-12 text-base transition-all duration-200 focus:scale-[1.02]"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold">
                                    كلمة المرور
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isPending}
                                        placeholder="أدخل كلمة المرور"
                                        className="h-12 text-base pr-12 transition-all duration-200 focus:scale-[1.02]"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 btn-primary"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        جاري التحقق...
                                    </div>
                                ) : (
                                    "دخول"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm text-muted-foreground pt-6 border-t border-dashed">
                            <p className="flex items-center justify-center gap-2 font-medium">
                                <Shield className="h-4 w-4 text-primary" />
                                وصول آمن ومشفر بالكامل
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
