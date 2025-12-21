"use client";

import { loginAction } from "@/actions/auth";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function LoginPage() {
    const { t } = useI18n();
    const [state, action, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t("Auth.sign_in")}</CardTitle>
                    <CardDescription>{t("Auth.enter_details")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        {state?.error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {state.error}
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
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t("Auth.password")}</Label>
                                <LocaleLink href="#" className="text-sm font-medium text-primary hover:underline">
                                    {t("Auth.forgot_password")}
                                </LocaleLink>
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
                            {t("Auth.sign_in")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        {t("Auth.no_account")}{" "}
                        <LocaleLink href="/register" className="font-medium text-primary hover:underline">
                            {t("Auth.register")}
                        </LocaleLink>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
