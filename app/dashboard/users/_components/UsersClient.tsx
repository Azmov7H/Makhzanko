"use client";

import { motion } from "framer-motion";
import { User, Plus, Edit, Trash2, Mail, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { deleteUserAction } from "@/actions/users";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UsersClientProps {
    users: any[];
}

export function UsersClient({ users }: UsersClientProps) {
    const { t } = useI18n();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-7xl mx-auto py-12 px-4 space-y-12 text-start"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-start">
                <motion.div variants={item} className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary/20 rounded-full blur-sm" />
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent italic">
                        {t("Users.title")}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg font-medium max-w-2xl">
                        {t("Users.description")}
                    </p>
                </motion.div>
                <div className="flex gap-4">
                    <Button asChild className="h-14 px-8 rounded-2xl bg-primary shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3 font-black text-xs uppercase tracking-widest group">
                        <Link href="/dashboard/users/new">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            {t("Users.add_user")}
                        </Link>
                    </Button>
                </div>
            </div>

            <motion.div variants={item}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map((user) => (
                        <Card key={user.id} className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:shadow-primary/5 hover:bg-card/80 transition-all duration-500 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                <User className="h-32 w-32 text-primary" />
                            </div>
                            <CardHeader className="p-8 pb-4 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-2xl text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className={cn(
                                            "rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border-none",
                                            user.role === "OWNER" ? "bg-amber-500/10 text-amber-500" :
                                                user.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {user.role}
                                        </Badge>
                                        <Badge variant="outline" className={cn(
                                            "rounded-xl px-2 py-1 border-none",
                                            user.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                        )}>
                                            {user.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                        </Badge>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-black italic">{user.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="h-3 w-3" /> {user.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 relative z-10">
                                <div className="mt-6 flex gap-3">
                                    <Button asChild variant="outline" className="flex-1 rounded-xl h-10 border-primary/10 hover:bg-primary/5 font-black uppercase text-[10px] tracking-widest gap-2">
                                        <Link href={`/dashboard/users/${user.id}/edit`}>
                                            <Edit className="h-3 w-3" /> {t("Common.edit")}
                                        </Link>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-destructive/10 hover:bg-destructive/5 text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px] p-2 bg-card/60 backdrop-blur-3xl border-none rounded-[1.5rem] shadow-3xl">
                                            <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 cursor-pointer py-3 transition-all text-destructive">
                                                <form action={async (formData) => { await deleteUserAction(formData); }} className="w-full">
                                                    <input type="hidden" name="id" value={user.id} />
                                                    <button type="submit" className="w-full flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                                                        <span>{t("Common.confirm_delete")}</span>
                                                    </button>
                                                </form>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {users.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 text-muted-foreground/30 gap-4">
                            <User className="h-16 w-16 opacity-20" />
                            <p className="font-black italic text-xl uppercase tracking-widest">{t("Users.no_users")}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
