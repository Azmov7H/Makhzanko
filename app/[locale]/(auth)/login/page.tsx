"use client";

import { loginAction } from "@/actions/auth";
import { Link } from "@/i18n/navigation";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("Auth");
    const [state, action, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t("sign_in")}</CardTitle>
                    <CardDescription>{t("enter_details")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        {state?.error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {state.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("placeholder_email")}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t("password")}</Label>
                                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                    {t("forgot_password")}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {t("sign_in")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        {t("no_account")}{" "}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            {t("register")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

