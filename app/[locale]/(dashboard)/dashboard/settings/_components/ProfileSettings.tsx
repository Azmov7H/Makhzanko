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
        <Card className="border-primary/5 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {t("Settings.profile_info")}
                </CardTitle>
                <CardDescription>{t("Settings.profile_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <form action={handleProfileUpdate} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="profile-name" className="text-sm font-bold">
                                {t("Settings.full_name")}
                            </Label>
                            <Input
                                id="profile-name"
                                name="name"
                                defaultValue={user.name || ""}
                                className="h-11 rounded-lg border-primary/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-email" className="text-sm font-bold">
                                {t("Settings.email_address")}
                            </Label>
                            <Input
                                id="profile-email"
                                defaultValue={user.email}
                                className="h-11 rounded-lg border-primary/10 bg-muted/50"
                                disabled
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Email cannot be changed directly. Contact support for help.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg w-fit border border-primary/5">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{t("Settings.user_role")}: </span>
                        <span className="font-bold text-foreground capitalize">{user.role.toLowerCase()}</span>
                    </div>

                    <Button
                        type="submit"
                        className="gap-2 h-11 px-8 rounded-lg shadow-lg shadow-primary/20"
                    >
                        <Save className="h-4 w-4" />
                        {t("Settings.save_changes")}
                    </Button>
                </form>

                <div className="my-8 h-px bg-primary/5 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]" />

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary/80">
                        <Shield className="h-5 w-5" />
                        <h3 className="font-bold">{t("Settings.security") || "Security & Password"}</h3>
                    </div>

                    <form action={handlePasswordChange} className="space-y-4 p-4 border rounded-lg bg-background/50">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">{t("Settings.current_password") || "Current Password"}</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">{t("Settings.new_password") || "New Password"}</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="bg-background"
                                />
                            </div>
                        </div>
                        <Button variant="outline" type="submit" className="w-full sm:w-auto">
                            {t("Settings.change_password") || "Change Password"}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
