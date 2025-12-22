"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Clock, Building2, Shield, ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sendChatMessageAction, endChatSessionAction } from "@/actions/chat";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    content: string;
    sender: "OWNER" | "CLIENT";
    senderName?: string;
    createdAt: Date;
}

export function AdminChatInterface({
    sessionId,
    initialMessages = [],
    tenantName,
    locale,
    status
}: {
    sessionId: string,
    initialMessages: Message[],
    tenantName: string,
    locale: string,
    status: string
}) {
    const { t } = useI18n();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending || status !== "ACTIVE") return;

        const content = input;
        setInput("");
        setIsSending(true);

        const result = await sendChatMessageAction({
            sessionId,
            content,
            sender: "OWNER",
            senderName: "Makhzanko Support"
        });

        if (result.success) {
            setMessages(prev => [...prev, {
                id: result.messageId || Date.now().toString(),
                content,
                sender: "OWNER",
                createdAt: new Date()
            }]);
        } else {
            toast.error(result.error);
        }
        setIsSending(false);
    };

    const handleEndSession = async () => {
        if (!confirm(t("Admin.support.end_session") + "?")) return;
        setIsEnding(true);
        const result = await endChatSessionAction(sessionId);
        if (result.success) {
            toast.success(t("Common.success"));
            router.push(`/${locale}/admin/support`);
        }
        setIsEnding(false);
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <Link href={`/${locale}/admin/support`}>
                    <Button variant="ghost" className="gap-2 hover:bg-primary/5">
                        <ArrowLeft className="h-4 w-4" />
                        {t("Common.cancel")}
                    </Button>
                </Link>
                {status === "ACTIVE" && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2 shadow-lg shadow-red-500/20"
                        onClick={handleEndSession}
                        disabled={isEnding}
                    >
                        <XCircle className="h-4 w-4" />
                        {t("Admin.support.end_session")}
                    </Button>
                )}
            </div>

            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground relative overflow-hidden">
                    {/* Decorative overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full bg-white/10 blur-3xl" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                <Building2 className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black">{tenantName}</CardTitle>
                                <CardDescription className="text-primary-foreground/80 flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4" />
                                    {t("Admin.support.session_details")}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none py-1.5 px-4 text-sm font-bold uppercase tracking-wider">
                            {status === 'ACTIVE' ? t("Dashboard.chat.active_now") : status}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <ScrollArea className="h-[500px] p-8" ref={scrollRef}>
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "OWNER" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === "OWNER" ? "items-end" : "items-start"}`}>
                                        <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.sender === "OWNER"
                                                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-none"
                                                : "bg-background border rounded-bl-none"
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                                {msg.sender === "OWNER" ? (
                                                    <Shield className="h-3 w-3" />
                                                ) : (
                                                    <Building2 className="h-3 w-3" />
                                                )}
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {msg.sender === "OWNER" ? t("Admin.title") : tenantName}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground px-2">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="p-6 border-t bg-muted/30 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={status === "ACTIVE" ? t("Dashboard.chat.type_message") : t("Admin.support.no_sessions")}
                            className="flex-1 h-12 rounded-xl bg-background border-none shadow-inner focus-visible:ring-primary"
                            disabled={isSending || status !== "ACTIVE"}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isSending || status !== "ACTIVE"}
                            className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
