"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, BarChart3, Package, Users, Receipt, AlertTriangle, Lightbulb, Settings2, Check, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { updateAIDialect } from "@/actions/ai";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
}

type Dialect = "FUSHA" | "EGYPTIAN" | "SAUDI" | "EMIRATI";

const DIALECTS: { id: Dialect, label: string, flag: string }[] = [
    { id: "FUSHA", label: "العربية الفصحى (Standard)", flag: "🌐" },
    { id: "EGYPTIAN", label: "العامية المصرية (Egyptian)", flag: "🇪🇬" },
    { id: "SAUDI", label: "اللهجة السعودية (Saudi)", flag: "🇸🇦" },
    { id: "EMIRATI", label: "اللهجة الإماراتية (Emirati)", flag: "🇦🇪" },
];

const GREETING = {
    en: "Welcome. I am your business intelligence manager. I can analyze risks, suggest improvements, and report performance.",
    ar: "مرحباً بك. أنا مدير ذكاء الأعمال الخاص بك. يمكنني تحليل المخاطر، اقتراح تحسينات، وتقديم تقارير الأداء."
};

const QUICK_ACTIONS = [
    { id: "risk", label: { en: "Risk Warning", ar: "تحذير المخاطر" }, icon: AlertTriangle, prompt: "risk warning", color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
    { id: "advice", label: { en: "Production Advice", ar: "نصائح الإنتاج" }, icon: Lightbulb, prompt: "production advice", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { id: "sales", label: { en: "Sales Analysis", ar: "تحليل المبيعات" }, icon: BarChart3, prompt: "sales summary", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "inventory", label: { en: "Stock Health", ar: "صحة المخزون" }, icon: Package, prompt: "low stock", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
];

export function ChatBot({ locale = "en" }: { locale?: string }) {
    const { locale: currentLocale } = useI18n();
    const effectiveLocale = (currentLocale || locale) as "en" | "ar";
    const isRtl = effectiveLocale === "ar";

    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentDialect, setCurrentDialect] = useState<Dialect>("FUSHA");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: "greeting",
                text: GREETING[effectiveLocale] || GREETING.en,
                sender: "bot",
                timestamp: new Date()
            }]);

            // Sync dialect from DB
            fetch("/api/tenant/ai-settings")
                .then(res => res.json())
                .then(data => { if (data.dialect) setCurrentDialect(data.dialect); })
                .catch(() => { });
        }
    }, [isOpen, effectiveLocale, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (forcedPrompt?: string) => {
        const textToSend = forcedPrompt || input;
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        const botMessageId = (Date.now() + 1).toString();

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

            if (!response.ok) throw new Error("Failed");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            const botMessage: Message = { id: botMessageId, text: "", sender: "bot", timestamp: new Date() };
            setMessages(prev => [...prev, botMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");
                    for (const line of lines) {
                        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                            try {
                                const data = JSON.parse(line.substring(6));
                                fullText += data.choices?.[0]?.delta?.content || "";
                                setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullText } : msg));
                            } catch (e) { }
                        }
                    }
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: botMessageId, text: isRtl ? "خطأ في الاتصال." : "Connection error.", sender: "bot", timestamp: new Date() }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleDialectChange = async (d: Dialect) => {
        setCurrentDialect(d);
        await updateAIDialect(d);
        setShowSettings(false);
        setMessages(prev => [...prev, {
            id: `sys-${Date.now()}`,
            text: isRtl ? `تم تحديث اللهجة إلى: ${DIALECTS.find(x => x.id === d)?.label}` : `Dialect updated to: ${d}`,
            sender: "bot",
            timestamp: new Date()
        }]);
    };

    return (
        <div className={isRtl ? "rtl" : "ltr"}>
            {/* Professional Floating Trigger */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all`}
                    >
                        <Bot className="h-6 w-6" />
                        <span className="font-bold text-sm tracking-tight">{isRtl ? "اسأل المحلل الذكي" : "Ask AI Analyst"}</span>
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 w-[440px] max-w-[calc(100vw-40px)] h-[700px] max-h-[calc(100vh-80px)] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_24px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden`}
                    >
                        {/* Professional Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-none">{isRtl ? "المحلل الذكي" : "AI Business Analyst"}</h3>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-widest">{isRtl ? "نشط الآن" : "System Active"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className={cn("rounded-lg", showSettings && "bg-slate-100 dark:bg-slate-800")}>
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-lg">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Settings Overlay */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                                    className="absolute inset-x-0 top-16 bottom-0 z-10 bg-white dark:bg-slate-950 p-6 flex flex-col"
                                >
                                    <div className="flex items-center gap-2 mb-6">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <h4 className="font-bold text-sm">{isRtl ? "إعدادات اللهجة والذكاء" : "AI Dialect & Intelligence"}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {DIALECTS.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => handleDialectChange(d.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-sm font-medium",
                                                    currentDialect === d.id ? "border-primary bg-primary/5 text-primary" : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span>{d.flag}</span>
                                                    <span>{d.label}</span>
                                                </div>
                                                {currentDialect === d.id && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-auto text-[11px] text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-xl leading-relaxed">
                                        {isRtl ? "اختيار اللهجة يغير طريقة تفاعل النظام معك ليصبح أكثر قرباً لطريقة عملك." : "Choosing a dialect changes how the AI interacts with you to feel more native."}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messaging Area */}
                        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((m) => (
                                    <div key={m.id} className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}>
                                        <div className={cn("max-w-[85%] flex flex-col", m.sender === "user" ? "items-end" : "items-start")}>
                                            <div className={cn(
                                                "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                                m.sender === "user"
                                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-tr-none"
                                                    : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none"
                                            )}>
                                                {m.text}
                                            </div>
                                            <span className="text-[9px] uppercase font-black text-muted-foreground/40 mt-1 tracking-tighter px-1">
                                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 rounded-2xl flex gap-1 items-center">
                                            <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Insights Panel */}
                        <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_ACTIONS.map(action => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleSend(action.prompt)}
                                        className={cn("flex items-center gap-2 p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group", action.color)}
                                    >
                                        <action.icon className="h-4 w-4 shrink-0" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{action.label[effectiveLocale] || action.label.en}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 pt-2">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                                <Input
                                    value={input} onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRtl ? "اطلب تحليلاً أو نصيحة..." : "Request analysis or advice..."}
                                    className="h-12 bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-2xl px-5 text-sm focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                                />
                                <div className={`absolute ${isRtl ? "left-2" : "right-2"}`}>
                                    <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-8 w-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                                        {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </form>
                            <p className="text-center text-[8px] font-black uppercase text-muted-foreground/30 mt-4 tracking-[0.3em]">
                                Business Insight Engine v3.0
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
