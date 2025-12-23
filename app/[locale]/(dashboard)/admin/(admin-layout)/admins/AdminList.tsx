"use client";

import { useState } from "react";
import {
    Trash2,
    Power,
    PowerOff,
    ShieldCheck,
    ShieldAlert,
    UserCircle,
    Calendar,
    BadgeCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    toggleAdminStatusAction,
    deleteAdminAction
} from "@/actions/admin/admin-management";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Admin {
    id: string;
    username: string;
    name: string | null;
    role: "SUPER" | "SUPPORT" | "FINANCE";
    isActive: boolean;
    createdAt: string;
}

export function AdminList({
    admins,
    locale
}: {
    admins: Admin[],
    locale: string
}) {
    const [items, setItems] = useState(admins);

    const handleToggle = async (id: string, current: boolean) => {
        const result = await toggleAdminStatusAction(id, !current);
        if (result.success) {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, isActive: !current } : item
            ));
            toast.success("تم تحديث حالة الحساب");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المدير؟ لا يمكن التراجع عن هذا الإجراء.")) return;
        const result = await deleteAdminAction(id);
        if (result.success) {
            setItems(prev => prev.filter(item => item.id !== id));
            toast.success("تم حذف حساب المدير");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "SUPER": return <Badge className="bg-purple-500 hover:bg-purple-600">مدير عام</Badge>;
            case "SUPPORT": return <Badge className="bg-blue-500 hover:bg-blue-600">دعم فني</Badge>;
            case "FINANCE": return <Badge className="bg-emerald-500 hover:bg-emerald-600">مالي</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <Card key={item.id} className={`border-none shadow-xl shadow-primary/5 transition-all overflow-hidden ${!item.isActive ? "opacity-60 grayscale-[0.8]" : ""
                    }`}>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-linear-to-br ${item.role === 'SUPER' ? 'from-purple-500 to-indigo-500' :
                                        item.role === 'SUPPORT' ? 'from-blue-500 to-cyan-500' : 'from-emerald-500 to-teal-500'
                                    } shadow-lg shadow-primary/20`}>
                                    <UserCircle className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{item.name || item.username}</h3>
                                        {getRoleBadge(item.role)}
                                        {!item.isActive && <Badge variant="destructive" className="text-[10px]">معطل</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="font-mono">@{item.username}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            انضم {format(new Date(item.createdAt), "MMMM yyyy", { locale: ar })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`gap-2 ${item.isActive ? 'text-amber-600' : 'text-emerald-600'}`}
                                    onClick={() => handleToggle(item.id, item.isActive)}
                                >
                                    {item.isActive ? (
                                        <>
                                            <PowerOff className="h-4 w-4" />
                                            تعطيل
                                        </>
                                    ) : (
                                        <>
                                            <Power className="h-4 w-4" />
                                            تفعيل
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {items.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                    <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">لا يوجد مدراء فرعيين حالياً</p>
                </div>
            )}
        </div>
    );
}
