"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { t } = useI18n();
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await login(formData);
    };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-2 transition-transform hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M16.5 9.4 7.55 4.24" />
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" y1="22" x2="12" y2="12" />
                    </svg>
                </div>
                <span className="font-cairo tracking-tight">{t("Dashboard.brand_name")}</span>
            </Link>

            <Card className="w-full max-w-md border-primary/10 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">{t("Auth.sign_in")}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t("Auth.enter_details")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/20 text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("Auth.email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("Auth.placeholder_email")}
                                required
                                className="rounded-xl bg-background/50 border-input/50 focus:bg-background focus:border-primary/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t("Auth.password")}</Label>
                                <Link href="/forgot-password" title="Forgot Password" className="text-xs font-medium text-primary hover:underline">
                                    {t("Auth.forgot_password")}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="rounded-xl bg-background/50 border-input/50 focus:bg-background focus:border-primary/50 transition-all"
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {t("Auth.sign_in")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-primary/5 pt-6 pb-6">
                    <div className="text-sm text-muted-foreground">
                        {t("Auth.no_account")}{" "}
                        <Link href="/register" title="Register" className="font-bold text-primary hover:underline">
                            {t("Auth.register")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
