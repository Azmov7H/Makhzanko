"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ownerLoginAction } from "@/actions/owner/auth";

export default function OwnerLoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await ownerLoginAction(formData);

            if (result?.error) {
                setError(result.error);
                toast.error(result.error);
            } else {
                toast.success("تم تسجيل الدخول بنجاح");
                router.push("/owner");
                router.refresh();
            }
        });
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)] animate-pulse" />
            </div>

            {/* Floating Shapes */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />

            {/* Login Card */}
            <Card className="relative w-full max-w-md shadow-2xl border-none backdrop-blur-xl bg-card/80 animate-fade-in-up">
                <CardHeader className="space-y-6 text-center pb-8">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-scale-in">
                        <Shield className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            لوحة المالك
                        </h1>
                        <p className="text-muted-foreground">
                            مرحباً بك في لوحة التحكم الرئيسية
                        </p>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-shake">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium">
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
                            <Label htmlFor="password" className="text-sm font-medium">
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
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p className="flex items-center justify-center gap-1">
                            <Shield className="h-4 w-4" />
                            منصة آمنة ومشفرة
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
