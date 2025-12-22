"use client";

import { useState } from "react";
import {
    Trash2,
    Power,
    PowerOff,
    Info,
    AlertTriangle,
    AlertCircle,
    Calendar,
    Users,
    Megaphone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    toggleAnnouncementAction,
    deleteAnnouncementAction
} from "@/actions/admin/announcements";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: "INFO" | "WARNING" | "CRITICAL";
    target: string;
    isActive: boolean;
    createdAt: string;
}

export function AnnouncementList({
    announcements,
    locale
}: {
    announcements: Announcement[],
    locale: string
}) {
    const [items, setItems] = useState(announcements);

    const handleToggle = async (id: string, current: boolean) => {
        const result = await toggleAnnouncementAction(id, !current);
        if (result.success) {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, isActive: !current } : item
            ));
            toast.success("تم تحديث حالة الإعلان");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
        const result = await deleteAnnouncementAction(id);
        if (result.success) {
            setItems(prev => prev.filter(item => item.id !== id));
            toast.success("تم حذف الإعلان");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "CRITICAL": return <AlertCircle className="h-4 w-4 text-red-500" />;
            case "WARNING": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <Card key={item.id} className={`border-none shadow-xl shadow-primary/5 transition-all overflow-hidden ${!item.isActive ? "opacity-60 grayscale-[0.5]" : ""
                    }`}>
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row items-stretch">
                            {/* Type Indicator */}
                            <div className={`w-2 h-auto ${item.type === 'CRITICAL' ? 'bg-red-500' :
                                item.type === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />

                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        {getIcon(item.type)}
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                                            {item.target}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(item.createdAt), "PPP", { locale: ar })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" />
                                            {item.target === 'ALL' ? 'كافة المستخدمين' : `مشتركي ${item.target}`}
                                        </span>
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
                                                إيقاف
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
                        </div>
                    </CardContent>
                </Card>
            ))}

            {items.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">لا يوجد إعلانات منشورة حالياً</p>
                </div>
            )}
        </div>
    );
}

