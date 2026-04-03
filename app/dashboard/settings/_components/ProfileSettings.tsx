"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth/AuthContext";

interface ProfileSettingsProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        role: string;
    };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const { t } = useI18n();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsUpdatingProfile(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update profile");
            }

            toast.success(t("Common.success") || "Profile updated");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsChangingPassword(true);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update password");
            }

            toast.success(t("Common.success") || "Password updated successfully");
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsChangingPassword(false);
        }
    }

    return (
        <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden text-start">
            <CardHeader className="bg-primary/5 border-b border-primary/5 py-8 px-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-black">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    {t("Settings.profile_info")}
                </CardTitle>
                <CardDescription className="text-base font-medium">{t("Settings.profile_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="profile-name" className="text-sm font-bold tracking-tight">
                                {t("Settings.full_name")}
                            </Label>
                            <Input
                                id="profile-name"
                                name="name"
                                defaultValue={user.name || ""}
                                className="h-12 rounded-2xl bg-muted/50 border-primary/10 font-medium"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="profile-email" className="text-sm font-bold tracking-tight">
                                {t("Settings.email_address")}
                            </Label>
                            <Input
                                id="profile-email"
                                defaultValue={user.email}
                                className="h-12 rounded-2xl border-primary/10 bg-muted/30 opacity-70"
                                disabled
                            />
                            <p className="text-[10px] text-muted-foreground font-medium px-2">
                                {t("Settings.profile.email_warning")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-primary/80 bg-primary/5 p-4 rounded-2xl w-fit border border-primary/10 font-bold">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>{t("Settings.user_role")}: </span>
                        <span className="text-foreground uppercase tracking-wider">{user.role}</span>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="gap-2 h-12 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                    >
                        {isUpdatingProfile ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {t("Settings.save_changes")}
                    </Button>
                </form>

                <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight">{t("Settings.profile.security_title")}</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6 p-8 border border-primary/5 rounded-3xl bg-muted/20 backdrop-blur-sm">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <Label htmlFor="currentPassword" className="font-bold">{t("Settings.profile.current_password")}</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    className="h-12 rounded-2xl bg-muted/50 border-primary/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="newPassword" className="font-bold">{t("Settings.profile.new_password")}</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="h-12 rounded-2xl bg-muted/50 border-primary/10"
                                />
                            </div>
                        </div>
                        <Button variant="outline" type="submit" disabled={isChangingPassword} className="h-12 px-8 rounded-2xl font-black border-primary/10 hover:bg-primary/5 transition-all">
                            {isChangingPassword ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : null}
                            {t("Settings.profile.change_password")}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
