"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Shield, UserPlus, AlertCircle } from "lucide-react";
import { addUserToTeam, deleteUserFromTeam, toggleDeferredPaymentAction } from "@/actions/settings";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PlanType, Role } from "@prisma/client";

interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    canDeferred: boolean;
}

interface TeamSettingsProps {
    users: User[];
    currentPlan: PlanType;
    currentUserId: string;
}

const PLAN_LIMITS = {
    [PlanType.FREE]: 2,
    [PlanType.PRO]: 10,
    [PlanType.BUSINESS]: "Unlimited",
};

export function TeamSettings({ users, currentPlan, currentUserId }: TeamSettingsProps) {
    const { t } = useI18n();
    const limit = PLAN_LIMITS[currentPlan];
    const isLimitReached = typeof limit === "number" && users.length >= limit;

    async function handleAddUser(formData: FormData) {
        const result = await addUserToTeam(formData);
        if (result.success) {
            toast.success(t("Common.success") || "User added");
        } else {
            toast.error(result.error || "Failed to add user");
        }
    }

    async function handleDeleteUser(userId: string) {
        if (!confirm(t("Common.confirm_delete") || "Are you sure?")) return;
        const result = await deleteUserFromTeam(userId);
        if (result.success) {
            toast.success(t("Common.success") || "User deleted");
        } else {
            toast.error(result.error || "Failed to delete user");
        }
    }

    return (
        <div className="space-y-8 text-start">
            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/5 py-8 px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            {t("Settings.team_members")}
                        </CardTitle>
                        <CardDescription className="text-base font-medium">{t("Settings.team_members_desc")}</CardDescription>
                    </div>
                    <Badge variant="outline" className="h-fit px-4 py-1.5 rounded-full font-black text-sm border-primary/20 bg-primary/5 text-primary">
                        {t("Settings.users_count", {
                            count: users.length,
                            limit: limit.toString(),
                        })}
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-primary/5">
                                    <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Settings.full_name")}</TableHead>
                                    <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Settings.user_email")}</TableHead>
                                    <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Settings.user_role")}</TableHead>
                                    <TableHead className="py-5 px-8 font-bold text-xs uppercase tracking-widest">{t("Settings.ajel_permission")}</TableHead>
                                    <TableHead className="py-5 px-8 text-right font-bold text-xs uppercase tracking-widest">{t("Common.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-primary/5 transition-all duration-300 border-primary/5">
                                        <TableCell className="font-bold py-5 px-8">
                                            <div className="flex items-center gap-2">
                                                {user.name || "-"}
                                                {user.id === currentUserId && (
                                                    <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter">
                                                        {t("Common.you") || "You"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-8 font-medium text-muted-foreground">{user.email}</TableCell>
                                        <TableCell className="py-5 px-8">
                                            <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider rounded-lg border-primary/20 bg-primary/5 text-primary">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-5 px-8">
                                            <Switch
                                                checked={user.canDeferred}
                                                onCheckedChange={async (val) => {
                                                    const res = await toggleDeferredPaymentAction(user.id, val);
                                                    if (res.success) toast.success(t("Common.success"));
                                                    else toast.error(res.error || t("Common.error"));
                                                }}
                                                disabled={user.role === Role.OWNER}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </TableCell>
                                        <TableCell className="py-5 px-8 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                                disabled={user.id === currentUserId}
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/5 border-b border-primary/5 py-8 px-8">
                    <CardTitle className="text-xl font-black flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-xl">
                            <UserPlus className="h-6 w-6 text-accent" />
                        </div>
                        {t("Settings.add_user")}
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                        {isLimitReached ? (
                            <span className="flex items-center gap-2 text-destructive font-bold">
                                <AlertCircle className="h-5 w-5" />
                                {t("Settings.plan_limit_reached")}. {t("Settings.upgrade_plan")}
                            </span>
                        ) : (
                            t("Settings.team_members_desc")
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={handleAddUser} className="grid sm:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="font-bold text-sm tracking-tight">{t("Settings.user_email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isLimitReached}
                                required
                                className="h-12 rounded-2xl bg-muted/50 border-primary/10"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="password" className="font-bold text-sm tracking-tight">{t("Auth.password")}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="text"
                                placeholder="***"
                                disabled={isLimitReached}
                                required
                                className="h-12 rounded-2xl bg-muted/50 border-primary/10"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="role" className="font-bold text-sm tracking-tight">{t("Settings.user_role")}</Label>
                            <Select name="role" defaultValue={Role.STAFF} disabled={isLimitReached}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/50 border-primary/10 font-bold">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-primary/10">
                                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                                    <SelectItem value={Role.STAFF}>Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full h-12 gap-2 rounded-2xl font-black shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
                                disabled={isLimitReached}
                            >
                                <UserPlus className="h-5 w-5" />
                                {t("Settings.add_user")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
