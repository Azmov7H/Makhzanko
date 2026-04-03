"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Clock, AlertCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth/AuthContext";

interface Message {
    id: string;
    content: string;
    sender: "OWNER" | "CLIENT";
    senderName?: string;
    createdAt: Date;
}

export function ChatInterface({
    initialSessionId,
    initialMessages = [],
    tenantName,
}: {
    initialSessionId?: string,
    initialMessages?: Message[],
    tenantName: string,
    locale?: string,
}) {
    const { t } = useI18n();
    const [sessionId, setSessionId] = useState(initialSessionId);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isStarting, setIsStarting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleStartChat = async () => {
        setIsStarting(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/sessions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setSessionId(data.id);
                toast.success(t("Dashboard.chat.started") || "Support chat started");
            } else {
                const error = await res.json();
                throw new Error(error.message || "Failed to start chat session");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to start chat session");
        } finally {
            setIsStarting(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId || isSending) return;

        const content = input;
        setInput("");
        setIsSending(true);

        try {
            const token = getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/sessions/${sessionId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    content,
                    sender: "CLIENT",
                    senderName: tenantName
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    id: data.id || Date.now().toString(),
                    content,
                    sender: "CLIENT",
                    createdAt: new Date()
                }]);
            } else {
                const error = await res.json();
                throw new Error(error.message || "Failed to send message");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to send message");
            setInput(content); // Restore input on failure
        } finally {
            setIsSending(false);
        }
    };

    if (!sessionId) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent scale-0 group-hover:scale-150 transition-transform duration-700" />
                    <Bot className="h-12 w-12 text-primary relative z-10" />
                </div>
                <h2 className="text-3xl font-black mb-3 tracking-tight italic">
                    {t("Dashboard.chat.need_help")}
                </h2>
                <p className="text-muted-foreground mb-10 max-w-sm text-lg font-medium">
                    {t("Dashboard.chat.need_help_desc")}
                </p>
                <Button onClick={handleStartChat} disabled={isStarting} className="h-14 px-12 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
                    {isStarting ? t("Dashboard.chat.starting") : t("Dashboard.chat.start_chat")}
                </Button>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-card/50 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-700">
            <CardHeader className="bg-primary text-primary-foreground p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-md">
                            <Clock className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">{t("Dashboard.chat.support")}</CardTitle>
                            <CardDescription className="text-primary-foreground/80 font-medium">
                                {t("Dashboard.chat.description")}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-white text-primary px-4 py-1.5 rounded-xl font-bold tracking-widest animate-pulse">
                        {t("Dashboard.chat.active_now")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 bg-muted/20">
                <ScrollArea className="h-[450px] p-8" ref={scrollRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <AlertCircle className="h-12 w-12 mb-4" />
                                <p className="text-lg font-bold">
                                    {t("Dashboard.chat.type_message_placeholder")}
                                </p>
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn("flex w-full", msg.sender === "CLIENT" ? "justify-end" : "justify-start")}
                                >
                                    <div className={cn(
                                        "max-w-[85%] rounded-[1.5rem] px-5 py-3 shadow-xl",
                                        msg.sender === "CLIENT"
                                            ? "bg-primary text-primary-foreground rounded-tr-sm shadow-primary/10"
                                            : "bg-background border-none rounded-tl-sm shadow-black/5"
                                    )}>
                                        <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">
                                            {msg.sender === "OWNER" ? t("Dashboard.chat.support") : t("Dashboard.chat.you")}
                                        </p>
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                        <div className={cn("flex mt-2", msg.sender === "CLIENT" ? "justify-end" : "justify-start")}>
                                            <p className="text-[10px] uppercase font-black tracking-widest opacity-50">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-6 border-t border-primary/5 bg-background/80 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex w-full gap-4">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("Dashboard.chat.type_message")}
                        className="flex-1 h-14 rounded-2xl bg-muted/50 border-primary/10 transition-all focus:ring-2 focus:ring-primary/20 text-lg font-medium"
                        disabled={isSending}
                    />
                    <Button type="submit" disabled={!input.trim() || isSending} className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        {isSending ? <Bot className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
