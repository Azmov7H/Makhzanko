"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, BarChart3, Package, Users, Receipt, AlertTriangle, Lightbulb, Settings2, Check, ChevronRight, ChevronLeft, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    { id: "sales", label: { en: "Sales", ar: "المبيعات" }, icon: BarChart3, prompt: "sales summary", color: "text-emerald-500 bg-emerald-500/10" },
    { id: "debt", label: { en: "Debts", ar: "المديونيات" }, icon: Receipt, prompt: "debt summary", color: "text-red-500 bg-red-500/10" },
    { id: "finance", label: { en: "Finance", ar: "المالية" }, icon: Sparkles, prompt: "financial summary", color: "text-amber-500 bg-amber-500/10" },
    { id: "inventory", label: { en: "Stock", ar: "المخزون" }, icon: Package, prompt: "low stock", color: "text-blue-500 bg-blue-500/10" },
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const clearChat = () => {
        setMessages([{
            id: "greeting",
            text: GREETING[effectiveLocale] || GREETING.en,
            sender: "bot",
            timestamp: new Date()
        }]);
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: "greeting",
                text: GREETING[effectiveLocale] || GREETING.en,
                sender: "bot",
                timestamp: new Date()
            }]);

            fetch("/api/tenant/ai-settings")
                .then(res => res.json())
                .then(data => { if (data.dialect) setCurrentDialect(data.dialect); })
                .catch(() => { });
        }
    }, [isOpen, effectiveLocale, messages.length]);

    useEffect(() => {
        scrollToBottom();
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
        // TODO: Replace with REST API call
        // const token = getAuthToken();
        // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/ai-settings`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        //     body: JSON.stringify({ dialect: d })
        // });
        
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
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="group relative flex items-center gap-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all border border-white/10 dark:border-slate-200 overflow-hidden"
                    >
                        {/* Background Pulse Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 dark:bg-slate-900/5 flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-slate-900/10 group-hover:scale-110 transition-transform duration-500">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950 dark:border-white"></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start relative z-10">
                            <span className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-500 mb-0.5">{isRtl ? "المساعد الذكي" : "AI ANALYST"}</span>
                            <span className="font-bold text-sm tracking-tight">{isRtl ? "كيف يمكنني مساعدتك؟" : "How can I help you?"}</span>
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
                        className="w-[480px] max-w-[calc(100vw-40px)] h-[750px] max-h-[calc(100vh-80px)] glass-dark bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] premium-shadow flex flex-col overflow-hidden relative"
                    >
                        {/* Ambient Glows */}
                        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                        
                        {/* Header */}
                        <div className="px-6 py-4 glass bg-white/5 border-b border-white/10 flex items-center justify-between relative z-20">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                    className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-950 shadow-lg"
                                >
                                    <Sparkles className="h-5 w-5" />
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-sm text-white tracking-tight" style={{ fontFamily: "var(--font-cairo), sans-serif" }}>{isRtl ? "مُحلل الأعمال" : "Insights Engine"}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[9px] text-emerald-500/80 uppercase font-black tracking-widest">{isRtl ? "نشط" : "Active"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={clearChat} title={isRtl ? "مسح المحادثة" : "Clear Chat"} className="h-9 w-9 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className={cn("h-9 w-9 text-white/50 rounded-lg transition-all", showSettings ? "bg-white/10 text-white" : "hover:bg-white/5")}>
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 text-white/50 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Settings Overlay */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
                                    className="absolute inset-0 z-30 bg-slate-950/95 p-8 flex flex-col pt-24 backdrop-blur-3xl"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <Globe className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm text-white uppercase tracking-wider">{isRtl ? "إعدادات المساعد" : "Assistant Settings"}</h4>
                                            <p className="text-[10px] text-white/50">{isRtl ? "تخصيص نمط الرد واللهجة" : "Customize response style & dialect"}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                        {DIALECTS.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => handleDialectChange(d.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                                                    currentDialect === d.id
                                                        ? "bg-white/10 border-white/20 text-white"
                                                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl">{d.flag}</span>
                                                    <span className="font-bold text-sm">{d.label}</span>
                                                </div>
                                                {currentDialect === d.id && <Check className="h-5 w-5 bg-white text-slate-900 p-1 rounded-full" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 px-6">
                            <div className="py-8 space-y-6">
                                {messages.map((m) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={m.id}
                                        className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}
                                    >
                                        <div className={cn("max-w-[85%] flex flex-col", m.sender === "user" ? "items-end" : "items-start")}>
                                            <div className={cn(
                                                "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                m.sender === "user"
                                                    ? "bg-primary text-white rounded-tr-none"
                                                    : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                                            )}>
                                                {m.text}
                                            </div>
                                            <span className="text-[9px] uppercase font-bold text-white/20 tracking-wider mt-1.5 px-2">
                                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/5 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center backdrop-blur-md">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                    className="h-1.5 w-1.5 bg-white/40 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-1" />
                            </div>
                        </ScrollArea>

                        {/* Actions */}
                        <div className="px-8 py-6 glass bg-white/5 border-y border-white/10 relative z-20">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-white/40">{isRtl ? "تحليلات ذكية سريعة" : "Smart Quick Actions"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {QUICK_ACTIONS.map(action => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleSend(action.prompt)}
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-2xl glass border border-white/5 text-white/70 hover:text-white transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden",
                                            "hover:border-white/20 hover:bg-white/10"
                                        )}
                                    >
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg", action.color)}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-tight">{action.label[effectiveLocale] || action.label.en}</span>

                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-slate-950/50 backdrop-blur-3xl relative z-20 border-t border-white/5">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-4">
                                <div className="relative flex-1">
                                    <input
                                        value={input} onChange={(e) => setInput(e.target.value)}
                                        placeholder={isRtl ? "اطلب تحليلاً، مديونية، أو نصيحة..." : "Type your command..."}
                                        className="w-full h-16 glass bg-white/5 border-white/10 rounded-[1.25rem] px-8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all shadow-inner"
                                    />
                                    <div className={`absolute inset-y-0 ${isRtl ? "left-0 pl-1" : "right-0 pr-1"} flex items-center`}>
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={!input.trim() || isTyping}
                                            className="h-14 w-14 rounded-2xl bg-white text-slate-950 hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95 disabled:opacity-30"
                                        >
                                            <Send className={cn("h-6 w-6 transition-transform", !isRtl && "rotate-0", isRtl && "rotate-180")} />
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <div className="flex justify-center mt-6">
                                <p className="text-[9px] uppercase font-black text-white/20 tracking-[0.4em]">Powered by Business Insight AI</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
