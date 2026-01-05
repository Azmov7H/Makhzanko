"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
    // English
    "pricing": "We offer 3 plans: Free (basic features), Pro ($29/month - advanced reports), and Business ($99/month - full features). All plans include a 14-day free trial!",
    "trial": "Yes! Every new account gets a 14-day free trial with full access to all features. No credit card required.",
    "support": "You can reach our support team via email at info@makhzanko.com or start a live chat session for immediate assistance.",
    "features": "Makhzanko includes: Inventory Management, Sales & Invoicing, Accounting (Chart of Accounts, Journal Entries), Multi-warehouse Support, Team Management, and more!",
    "invoice": "You can create professional invoices from any sale. Go to Sales > New Sale, add items and customer info, then complete the sale to generate an invoice.",

    // Arabic
    "أسعار": "نقدم 3 خطط: مجانية (ميزات أساسية)، احترافية (29$/شهر)، وأعمال (99$/شهر). جميع الخطط تشمل تجربة مجانية 14 يوم!",
    "تجريبي": "نعم! كل حساب جديد يحصل على تجربة مجانية 14 يوم مع وصول كامل لجميع الميزات. لا حاجة لبطاقة ائتمان.",
    "دعم": "يمكنك التواصل مع فريق الدعم عبر البريد info@makhzanko.com أو بدء محادثة مباشرة للمساعدة الفورية.",
    "ميزات": "مخزنكو يشمل: إدارة المخازن، المبيعات والفواتير، المحاسبة، دعم مخازن متعددة، إدارة الفريق، والمزيد!",
    "فاتورة": "يمكنك إنشاء فواتير احترافية من أي عملية بيع. اذهب إلى المبيعات > بيع جديد، أضف المنتجات ومعلومات العميل.",
};

const GREETING = {
    en: "Hello! 👋 I'm Makhzanko Assistant. How can I help you today?\n\nYou can ask about:\n• Pricing & Plans\n• Features\n• Trial period\n• Invoice creation\n• Support",
    ar: "مرحباً! 👋 أنا مساعد مخزنكو. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك السؤال عن:\n• الأسعار والخطط\n• الميزات\n• الفترة التجريبية\n• إنشاء الفواتير\n• الدعم الفني"
};

export function ChatBot({ locale = "en" }: { locale?: string }) {
    const { t, locale: currentLocale } = useI18n();
    const effectiveLocale = (currentLocale || locale) as "en" | "ar";

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Add greeting message
            setMessages([{
                id: "greeting",
                text: GREETING[effectiveLocale] || GREETING.en,
                sender: "bot",
                timestamp: new Date()
            }]);
        }
    }, [isOpen, effectiveLocale, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const findResponse = (text: string): string => {
        const lowerText = text.toLowerCase();

        for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
            if (lowerText.includes(keyword.toLowerCase())) {
                return response;
            }
        }

        return effectiveLocale === "ar"
            ? "شكراً على رسالتك! للحصول على مساعدة مباشرة، يرجى التواصل مع فريق الدعم عبر info@makhzanko.com"
            : "Thanks for your message! For direct assistance, please contact our support team at info@makhzanko.com";
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");

        // Create a placeholder for the bot message
        const botMessageId = (Date.now() + 1).toString();
        const botMessage: Message = {
            id: botMessageId,
            text: "",
            sender: "bot",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages.concat(userMessage).map(m => ({
                        role: m.sender === "user" ? "user" : "assistant",
                        content: m.text
                    }))
                })
            });

            if (!response.ok) throw new Error("Failed to get AI response");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    // Assuming SSE or raw text stream. For simplicity with raw text:
                    fullText += chunk;

                    setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId ? { ...msg, text: fullText } : msg
                    ));
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === botMessageId ? { ...msg, text: "Sorry, I'm having trouble connecting to the AI server. Please try again later." } : msg
            ));
        }
    };

    return (
        <div className={effectiveLocale === "ar" ? "rtl" : "ltr"}>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className={`fixed bottom-6 ${effectiveLocale === "ar" ? "left-6" : "right-6"} z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95`}
                    >
                        <MessageCircle className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-6 ${effectiveLocale === "ar" ? "left-6" : "right-6"} z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card rounded-2xl shadow-2xl border overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{t("Dashboard.chat.assistant")}</h3>
                                    <p className="text-xs opacity-75">{t("Dashboard.chat.online")}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-primary-foreground hover:bg-primary-foreground/20"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-md"
                                            : "bg-muted rounded-bl-md"
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                            <p className="text-[10px] opacity-50 mt-1">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-muted/30">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t("Dashboard.chat.type_message")}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
