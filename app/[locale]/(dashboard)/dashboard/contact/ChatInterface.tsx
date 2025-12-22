"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Clock, AlertCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { startChatSessionAction, sendChatMessageAction } from "@/actions/chat";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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
    locale
}: {
    initialSessionId?: string,
    initialMessages?: Message[],
    tenantName: string,
    locale: string
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
        const result = await startChatSessionAction();
        if (result.success && result.sessionId) {
            setSessionId(result.sessionId);
        }
        setIsStarting(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId || isSending) return;

        const content = input;
        setInput("");
        setIsSending(true);

        const result = await sendChatMessageAction({
            sessionId,
            content,
            sender: "CLIENT",
            senderName: tenantName
        });

        if (result.success) {
            setMessages(prev => [...prev, {
                id: result.messageId || Date.now().toString(),
                content,
                sender: "CLIENT",
                createdAt: new Date()
            }]);
        } else {
            toast.error(result.error);
        }
        setIsSending(false);
    };

    if (!sessionId) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                    <Bot className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {t("Dashboard.chat.need_help")}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    {t("Dashboard.chat.need_help_desc")}
                </p>
                <Button onClick={handleStartChat} disabled={isStarting} size="lg" className="px-8 font-bold shadow-lg hover:shadow-primary/20 transition-all">
                    {isStarting ? t("Dashboard.chat.starting") : t("Dashboard.chat.start_chat")}
                </Button>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-card overflow-hidden animate-in zoom-in-95 duration-500">
            <CardHeader className="bg-primary text-primary-foreground p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{t("Dashboard.chat.support")}</CardTitle>
                            <CardDescription className="text-primary-foreground/70">
                                {t("Dashboard.chat.description")}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary-foreground text-primary animate-pulse">
                        {t("Dashboard.chat.active_now")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 bg-muted/5">
                <ScrollArea className="h-[400px] p-6" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p className="text-sm">
                                    {t("Dashboard.chat.type_message_placeholder")}
                                </p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "CLIENT" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === "CLIENT"
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-background border rounded-bl-none shadow-sm"
                                    }`}>
                                    <p className="text-sm font-medium mb-1 drop-shadow-sm">
                                        {msg.sender === "OWNER" ? t("Dashboard.chat.support") : t("Dashboard.chat.you")}
                                    </p>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-[10px] opacity-60 mt-1 text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("Dashboard.chat.type_message")}
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button type="submit" disabled={!input.trim() || isSending} size="icon" className="h-10 w-10 btn-primary">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
