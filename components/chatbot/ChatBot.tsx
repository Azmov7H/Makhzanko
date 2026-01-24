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
    { id: "sales", label: { en: "Sales", ar: "المبيعات" }, icon: BarChart3, prompt: "sales summary", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "debt", label: { en: "Debts", ar: "المديونيات" }, icon: Receipt, prompt: "debt summary", color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
    { id: "finance", label: { en: "Finance", ar: "المالية" }, icon: Sparkles, prompt: "financial summary", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { id: "inventory", label: { en: "Stock", ar: "المخزون" }, icon: Package, prompt: "low stock", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
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
        <div className={cn("fixed bottom-6 z-50", isRtl ? "left-6" : "right-6", isRtl ? "rtl" : "ltr")}>
            {/* Professional Floating Trigger */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all border border-white/10 dark:border-slate-200"
                    >
                        <div className="relative">
                            <Bot className="h-6 w-6" />
                            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900 dark:border-white"></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start translate-y-[-1px]">
                            <span className="font-black text-xs uppercase tracking-[0.2em] opacity-50 mb-0.5">{isRtl ? "المحلل الذكي" : "AI Analyst"}</span>
                            <span className="font-bold text-sm">{isRtl ? "كيف أخدمك اليوم؟" : "How can I help?"}</span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="w-[480px] max-w-[calc(100vw-40px)] h-[750px] max-h-[calc(100vh-80px)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative"
                    >
                        {/* Status Glow Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

                        {/* Professional Header */}
                        <div className="p-6 border-b border-primary/5 flex items-center justify-between relative z-20">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl"
                                >
                                    <Sparkles className="h-6 w-6" />
                                </motion.div>
                                <div>
                                    <h3 className="font-black text-base tracking-tight">{isRtl ? "مدير ذكاء الأعمال" : "Business Insight Engine"}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{isRtl ? "تحليل مباشر نشط" : "Live Analysis Active"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className={cn("h-10 w-10 rounded-xl transition-all", showSettings ? "bg-primary/10 text-primary" : "hover:bg-primary/5")}>
                                    <Settings2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Settings Overlay */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-x-4 top-24 bottom-24 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-8 rounded-[2rem] border border-primary/10 shadow-2xl flex flex-col"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-primary/10 rounded-xl">
                                            <Globe className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-wider">{isRtl ? "إعدادات المساعد" : "Assistant Settings"}</h4>
                                            <p className="text-[10px] text-muted-foreground">{isRtl ? "تخصيص نمط الرد واللهجة" : "Customize response style & dialect"}</p>
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 -mx-2 px-2">
                                        <div className="space-y-3">
                                            {DIALECTS.map((d) => (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    key={d.id}
                                                    onClick={() => handleDialectChange(d.id)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                                                        currentDialect === d.id
                                                            ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                                            : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-2xl">{d.flag}</span>
                                                        <span className="font-bold text-sm">{d.label}</span>
                                                    </div>
                                                    {currentDialect === d.id && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <Check className="h-5 w-5 bg-primary text-white p-1 rounded-full" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className="mt-8 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-[11px] font-medium leading-relaxed text-primary/80">
                                            {isRtl ? "تغيير اللهجة يؤثر على شخصية النظام وطريقة عرضه للبيانات والنصائح البرمجية." : "Changing the dialect affects the system's personality and how it presents data and advice."}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messaging Area */}
                        <ScrollArea className="flex-1 px-6 relative z-10" ref={scrollRef}>
                            <div className="py-8 space-y-8">
                                {messages.map((m, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={m.id}
                                        className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}
                                    >
                                        <div className={cn("max-w-[88%] flex flex-col", m.sender === "user" ? "items-end" : "items-start")}>
                                            <div className={cn(
                                                "px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm border",
                                                m.sender === "user"
                                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-tr-none border-white/10 dark:border-slate-200"
                                                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-100 dark:border-slate-800"
                                            )}>
                                                {m.text}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 px-2">
                                                <span className="text-[9px] uppercase font-black text-muted-foreground/30 tracking-widest">
                                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {m.sender === "bot" && idx === messages.length - 1 && !isTyping && (
                                                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 items-center shadow-sm">
                                            {[0, 150, 300].map((delay) => (
                                                <motion.div
                                                    key={delay}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                                                    className="h-2 w-2 bg-primary/40 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Insights Panel */}
                        <div className="px-6 py-5 bg-slate-50/50 dark:bg-white/5 border-y border-primary/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="h-3 w-3 text-primary" />
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">{isRtl ? "تحليلات سريعة" : "Quick Insights"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {QUICK_ACTIONS.map(action => (
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        key={action.id}
                                        onClick={() => handleSend(action.prompt)}
                                        className={cn("flex items-center gap-3 p-3.5 rounded-2xl border transition-all group backdrop-blur-md",
                                            "bg-white/40 dark:bg-slate-900/40 border-primary/5 hover:border-primary/20",
                                            action.color)}
                                    >
                                        <div className="p-1.5 rounded-lg bg-current/10">
                                            <action.icon className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-tight">{action.label[effectiveLocale] || action.label.en}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-8 pt-4 bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl relative z-20">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center group">
                                <Input
                                    value={input} onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRtl ? "اطلب تحليلاً، مديونية، أو نصيحة..." : "Request analysis, debts, or advice..."}
                                    className="h-14 bg-white dark:bg-slate-900 border-primary/10 rounded-2xl px-6 text-sm focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-xl shadow-primary/5 pr-14"
                                />
                                <div className={`absolute ${isRtl ? "left-2" : "right-2"}`}>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!input.trim() || isTyping}
                                        className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </form>
                            <div className="flex items-center justify-between mt-6 opacity-30 group-hover:opacity-50 transition-opacity">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <p className="px-4 text-[8px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
                                    CORE AI v4.0 PRO
                                </p>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            </div>
                        </div>

                        {/* Decorative Blur Elements */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
