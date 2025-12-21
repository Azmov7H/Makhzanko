"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Shield, UserPlus, AlertCircle } from "lucide-react";
import { addUserToTeam, deleteUserFromTeam } from "@/actions/settings";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
        <div className="space-y-6">
            <Card className="border-primary/5 shadow-sm">
                <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {t("Settings.team_members")}
                        </CardTitle>
                        <CardDescription>{t("Settings.team_members_desc")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="h-fit">
                        {t("Settings.users_count", {
                            count: users.length,
                            limit: limit.toString(),
                        })}
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Settings.full_name")}</TableHead>
                                <TableHead>{t("Settings.user_email")}</TableHead>
                                <TableHead>{t("Settings.user_role")}</TableHead>
                                <TableHead className="text-right">{t("Common.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name || "-"}
                                        {user.id === currentUserId && (
                                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            disabled={user.id === currentUserId}
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        {t("Settings.add_user")}
                    </CardTitle>
                    <CardDescription>
                        {isLimitReached ? (
                            <span className="flex items-center gap-1 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                {t("Settings.plan_limit_reached")}. {t("Settings.upgrade_plan")}
                            </span>
                        ) : (
                            t("Settings.team_members_desc")
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleAddUser} className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("Settings.user_email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isLimitReached}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t("Auth.password")}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="text"
                                placeholder="***"
                                disabled={isLimitReached}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">{t("Settings.user_role")}</Label>
                            <Select name="role" defaultValue={Role.STAFF} disabled={isLimitReached}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                                    <SelectItem value={Role.STAFF}>Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full gap-2"
                                disabled={isLimitReached}
                            >
                                <UserPlus className="h-4 w-4" />
                                {t("Settings.add_user")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
