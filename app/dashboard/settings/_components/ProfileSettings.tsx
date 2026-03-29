"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, Shield } from "lucide-react";
import { updateProfile } from "@/actions/settings";
import { toast } from "sonner";
import { Role } from "@prisma/client";

import { changePassword } from "@/actions/settings";

interface ProfileSettingsProps {
    user: {
        name: string | null;
        email: string;
        role: Role;
    };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const { t } = useI18n();

    async function handleProfileUpdate(formData: FormData) {
        const result = await updateProfile(formData);
        if (result.success) {
            toast.success(t("Common.success") || "Profile updated");
        } else {
            toast.error(result.error || "Failed to update profile");
        }
    }

    async function handlePasswordChange(formData: FormData) {
        const result = await changePassword(formData);
        if (result.success) {
            toast.success(t("Common.success") || "Password updated successfully");
        } else {
            toast.error(result.error || "Failed to update password");
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
                <form action={handleProfileUpdate} className="space-y-8">
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
                        className="gap-2 h-12 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                    >
                        <Save className="h-5 w-5" />
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

                    <form action={handlePasswordChange} className="space-y-6 p-8 border border-primary/5 rounded-3xl bg-muted/20 backdrop-blur-sm">
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
                        <Button variant="outline" type="submit" className="h-12 px-8 rounded-2xl font-black border-primary/10 hover:bg-primary/5 transition-all">
                            {t("Settings.profile.change_password")}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
