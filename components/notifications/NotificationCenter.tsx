"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { toast } from "sonner";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    status: string;
    link: string | null;
    createdAt: string;
}

interface NotificationCenterProps {
    locale: string;
    translations: {
        title: string;
        mark_all_read: string;
        no_notifications: string;
        unread: string;
        delete: string;
    };
}

export function NotificationCenter({ locale, translations }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll every 1 minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAllAsRead = async () => {
        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                body: JSON.stringify({ action: "markAllRead" }),
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, status: "read" })));
                setUnreadCount(0);
            }
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
            });
            if (res.ok) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, status: "read" } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setNotifications(notifications.filter(n => n.id !== id));
                const deleted = notifications.find(n => n.id === id);
                if (deleted?.status === "unread") {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
            case "success": return <CheckCircle className="h-4 w-4 text-success" />;
            case "error": return <XCircle className="h-4 w-4 text-destructive" />;
            default: return <Info className="h-4 w-4 text-info" />;
        }
    };

    const dateLocale = locale === "ar" ? ar : enUS;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 w-9 h-9 relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 overflow-hidden rounded-2xl border-primary/10 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <h4 className="font-bold text-sm">{translations.title}</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg">
                            <Check className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                            {translations.mark_all_read}
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[350px]">
                    {loading && notifications.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                            <div className="bg-primary/5 p-3 rounded-full">
                                <Bell className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">{translations.no_notifications}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors group cursor-pointer",
                                        n.status === "unread" && "bg-primary/5"
                                    )}
                                    onClick={() => n.status === "unread" && markAsRead(n.id)}
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        {getTypeIcon(n.type)}
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-xs font-bold truncate", n.status === "unread" ? "text-foreground" : "text-muted-foreground")}>
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: dateLocale })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                            {n.status === "unread" && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                                    className="p-1 hover:bg-primary/10 rounded-md text-primary"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                className="p-1 hover:bg-destructive/10 rounded-md text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-2 bg-muted/10 border-t">
                        <Button variant="ghost" className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground">
                            {translations.unread} ({unreadCount})
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
