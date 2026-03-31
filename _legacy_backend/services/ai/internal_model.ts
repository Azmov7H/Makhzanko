import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AIResponseStream {
    stream: ReadableStream;
    id: string;
}

type Dialect = "FUSHA" | "EGYPTIAN" | "SAUDI" | "EMIRATI";

export class InternalModelService {

    /**
     * Generate a streaming response based on internal rules and dialect
     */
    static async generateStreamingResponse(messages: ChatMessage[], tenantId: string): Promise<AIResponseStream> {
        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content.toLowerCase().trim();
        const isArabic = this.containsArabic(userQuery);

        // Fetch tenant dialect
        const tenant = await db.tenant.findUnique({
            where: { id: tenantId },
            select: { aiDialect: true }
        });

        const dialect = (tenant as any)?.aiDialect || 'FUSHA';

        let responseText = "";

        // 1. Check AI Knowledge Base (DB)
        const knowledgeAnswer = await this.queryAIKnowledge(userQuery, tenantId);
        if (knowledgeAnswer) {
            responseText = knowledgeAnswer;
        }
        // 2. Data Insights & Logic
        else if (this.matches(userQuery, ["hi", "hello", "hey", "مرحبا", "اهلا", "سلام", "ازيك", "اشحالكم", "هلا"])) {
            responseText = this.getGreeting(dialect, isArabic);
        }
        else if (this.matches(userQuery, ["debt", "installment", "pay", "collect", "دين", "ديون", "قسط", "اقساط", "تحصيل", "مستحقات"])) {
            responseText = await this.getDebtSummary(tenantId, isArabic, dialect);
        }
        else if (this.matches(userQuery, ["finance", "treasury", "cash", "money", "مالية", "خزينة", "فلوس", "كاش", "ارباح", "سيولة"])) {
            responseText = await this.getFinancialSummary(tenantId, isArabic, dialect);
        }
        else if (this.matches(userQuery, ["supplier", "vendor", "purchase", "مورد", "موردين", "شراء", "توريد"])) {
            responseText = await this.getSupplierStats(tenantId, isArabic, dialect);
        }
        else if (this.matches(userQuery, ["customer", "client", "people", "عملاء", "عميل", "زبون"])) {
            responseText = await this.getCustomerStats(tenantId, isArabic, dialect);
        }
        else {
            responseText = this.getFallbackMessage(dialect, isArabic);
        }

        // Add a conversational touch if Arabic
        if (isArabic) {
            responseText = this.applyDialectPersonality(responseText, dialect);
        }

        // Create a ReadableStream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                const chunk = { choices: [{ delta: { content: responseText } }] };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
            }
        });

        return { stream, id: `internal-${Date.now()}` };
    }

    // --- Dialect & Tone Helpers ---

    private static applyDialectPersonality(text: string, dialect: Dialect): string {
        const fillers: Record<Dialect, string[]> = {
            FUSHA: ["عزيزي المستخدم،", "يرجى ملاحظة أن", "بناءً على البيانات الموجودة:"],
            EGYPTIAN: ["يا باشا،", "بص بقى،", "خد بالك يا ريس،", "الموضوع وما فيه:"],
            SAUDI: ["طال عمرك،", "يا هلا والله،", "شوف يا طويل العمر،", "أبشر بالخير:"],
            EMIRATI: ["يا خوي،", "حياك الله،", "فالك طيب،", "العلوم هي:"]
        };

        const randomFiller = fillers[dialect][Math.floor(Math.random() * fillers[dialect].length)];
        return `${randomFiller}\n\n${text}`;
    }

    private static getGreeting(dialect: Dialect, isArabic: boolean): string {
        if (!isArabic) return "Hello! I am your Makhzanko AI. I can help with sales reports, risks, and business advice. How can I help?";

        const greetings: Record<Dialect, string> = {
            FUSHA: "أهلاً بك! أنا مساعد مخزنكو الذكي. كيف يمكنني مساعدتك في إدارة أعمالك اليوم؟",
            EGYPTIAN: "أهلاً بيك يا باشا! أنا مساعد مخزنكو الذكي. تحب نعرف مبيعاتك كام ولا نشوف إحصائياتك؟ أنا معاك في أي حاجة!",
            SAUDI: "يا هلا والله ومرحبا! أنا مساعد مخزنكو. أبشر باللي تبي، تبيني أعطيك تقارير المبيعات ولا المخزون؟ سم!",
            EMIRATI: "حياك الله يا خوي! أنا مساعد مخزنكو. وشو اللي في خاطرك اليوم؟ تبا تقارير ولا تحذيرات من المخاطر؟ فالك طيب."
        };
        return greetings[dialect];
    }

    private static getFallbackMessage(dialect: Dialect, isArabic: boolean): string {
        if (!isArabic) return "I didn't quite catch that. Try asking about 'Sales', 'Risks', 'Advice', or 'Inventory'.";

        const fallbacks: Record<Dialect, string> = {
            FUSHA: "عذراً، لم أفهم طلبك. جرب السؤال عن 'المبيعات'، 'المخاطر'، 'نصائح الإنتاج' أو 'المخزون'.",
            EGYPTIAN: "معلش يا باشا مفهمتش قصدك إيه بالضبط. اسألني عن 'المبيعات'، 'المخاطر'، أو 'إزاي أحسن الإنتاج'.",
            SAUDI: "المعذرة منك، ما فهمت سؤالك تمام. اسألني عن 'المبيعات'، 'المخاطر' أو 'وشلون أحسن شغلي'.",
            EMIRATI: "السموحة منك يا الطيب، ما لقطت الرمسة. اسأل عن 'المبيعات' أو 'المخاطر' وأبشر بالسعد."
        };
        return fallbacks[dialect];
    }

    // --- Business Intelligence (Risk & Advice) ---

    private static async getRiskWarnings(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        // Analysis 1: Stockouts vs Sales Speed
        const lowStock = await db.product.findMany({
            where: { tenantId, stocks: { some: { quantity: { lte: 3 } } } },
            include: { stocks: true, saleItems: { take: 5, orderBy: { sale: { date: 'desc' } } } }
        });

        const highRisk = lowStock.filter(p => p.saleItems.length > 0);

        if (highRisk.length === 0) {
            return isArabic
                ? "لا توجد مخاطر فورية مكتشفة. الوضع مستقر تماماً."
                : "No immediate risks detected. Your operations look stable.";
        }

        let msg = isArabic ? "**تحذير من مخاطر وشيكة:**\n" : "**Immediate Risk Warnings:**\n";
        highRisk.forEach(p => {
            msg += `- **${p.name}**: ${isArabic ? 'المخزون حرج جداً وهناك طلب مستمر عليه. قد تفقد مبيعات قريباً!' : 'Critical stock with high velocity. You might lose sales soon!'}\n`;
        });
        return msg;
    }

    private static async getProductionAdvice(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const topProducts = await db.saleItem.groupBy({
            by: ['productId'],
            where: { sale: { tenantId, status: "COMPLETED" } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 3
        });

        if (topProducts.length === 0) return isArabic ? "أحتاج لمزيد من بيانات المبيعات لأعطيك نصيحة دقيقة." : "I need more sales data to provide accurate advice.";

        const productIds = topProducts.map(p => p.productId);
        const products = await db.product.findMany({
            where: { id: { in: productIds } },
            select: { name: true }
        });

        let msg = isArabic ? "**نصائح لتحسين الإنتاج والنمو:**\n" : "**Production & Growth Advice:**\n";
        msg += isArabic
            ? `1. ركز على منتجاتك الأكثر طلباً مثل (${products.map(p => p.name).join(', ')}) وقم بتوفير عروض باقات (Bundles).\n`
            : `1. Focus on your high-demand items like (${products.map(p => p.name).join(', ')}) and create bundle offers.\n`;
        msg += isArabic
            ? "2. لاحظت أن بعض المنتجات بها نسبة هوامش ربح عالية لكن مبيعاتها قليلة، ربما تحتاج لتحسين التسويق لها.\n"
            : "2. Some high-margin items have low volume; consider better marketing placement for them.\n";

        return msg;
    }

    // --- Core Data Fetchers (Updated with Dialect Tone) ---

    private static async getDebtSummary(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const pendingInstallments = await db.installment.findMany({
            where: { tenantId, status: PaymentStatus.UNPAID },
            select: { amount: true, customerId: true, supplierId: true }
        });

        const toCollect = pendingInstallments
            .filter((i: any) => i.customerId !== null)
            .reduce((sum: number, i: any) => sum + Number(i.amount), 0);

        const toPay = pendingInstallments
            .filter((i: any) => i.supplierId !== null)
            .reduce((sum: number, i: any) => sum + Number(i.amount), 0);

        if (pendingInstallments.length === 0) {
            return isArabic
                ? "لا توجد أقساط أو ديون معلقة حالياً. سجلاتك نظيفة!"
                : "No pending installments or debts found. Your records are clear!";
        }

        let msg = isArabic ? "**ملخص المديونيات والأقساط:**\n" : "**Debt & Installment Summary:**\n";
        msg += `- ${isArabic ? 'مستحقات للتحصيل (من عملاء)' : 'To Collect (from customers)'}: **${formatCurrency(toCollect)}**\n`;
        msg += `- ${isArabic ? 'مدفوعات مطلوبة (لموردين)' : 'To Pay (to suppliers)'}: **${formatCurrency(toPay)}**\n`;

        if (toPay > toCollect) {
            msg += `\n> [!WARNING]\n> ${isArabic
                ? "مدفوعاتك للموردين أكبر من تحصيلاتك، يرجى الحذر وتوفير سيولة كافية."
                : "Payables exceed receivables. Please ensure sufficient liquidity."}`;
        }

        return msg;
    }

    private static async getFinancialSummary(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sales Revenue
        const sales = await db.sale.findMany({ where: { tenantId, date: { gte: today }, status: "COMPLETED" } });
        const revenue = sales.reduce((sum: number, s: any) => sum + Number(s.total), 0);

        // Supplier Payments
        const payments = await db.supplierPayment.findMany({ where: { tenantId, date: { gte: today } } });
        const expenses = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

        const net = revenue - expenses;

        let msg = isArabic ? `**الوضع المالي لليوم (${today.toLocaleDateString()}):**\n` : `**Financial Status for Today (${today.toLocaleDateString()}):**\n`;
        msg += `- ${isArabic ? 'إجمالي المبيعات' : 'Total Sales'}: **${formatCurrency(revenue)}**\n`;
        msg += `- ${isArabic ? 'مدفوعات الموردين' : 'Supplier Payments'}: **${formatCurrency(expenses)}**\n`;
        msg += `- ${isArabic ? 'صافي الحركة' : 'Net Activity'}: **${formatCurrency(net)}**\n`;

        return msg;
    }

    private static async getSupplierStats(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const suppliers = await db.supplier.findMany({
            where: { tenantId },
            include: { purchases: true }
        });

        if (suppliers.length === 0) return isArabic ? "لم تقم بإضافة أي موردين بعد." : "No suppliers added yet.";

        const topSupplier = suppliers.sort((a: any, b: any) => b.purchases.length - a.purchases.length)[0];

        let msg = isArabic ? "**إحصائيات الموردين:**\n" : "**Supplier Statistics:**\n";
        msg += `- ${isArabic ? 'إجمالي الموردين' : 'Total Suppliers'}: **${suppliers.length}**\n`;
        msg += `- ${isArabic ? 'المورد الأكثر تعاملاً' : 'Most frequent supplier'}: **${topSupplier.name}** (${topSupplier.purchases.length} ${isArabic ? 'طلبات' : 'orders'})\n`;

        return msg;
    }

    private static async getSalesSummary(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sales = await db.sale.findMany({ where: { tenantId, date: { gte: today }, status: "COMPLETED" } });
        const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.total), 0);

        if (sales.length === 0) {
            return isArabic ? "لم يتم تسجيل أي مبيعات اليوم حتى الآن. نأمل أن يتحسن الوضع قريباً!" : "No sales recorded yet today.";
        }

        return isArabic
            ? `إجمالي مبيعات اليوم هو **${formatCurrency(totalRevenue)}** من خلال **${sales.length}** عملية بيع مكتملة.`
            : `Today's total sales revenue is **${formatCurrency(totalRevenue)}** from **${sales.length}** completed transactions.`;
    }

    private static async getLowStockAlerts(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const products = await db.product.findMany({
            where: { tenantId, stocks: { some: { quantity: { lte: 5 } } } },
            take: 5,
            select: { name: true, stocks: { select: { quantity: true, warehouse: { select: { name: true } } } } }
        });

        if (products.length === 0) return isArabic ? "مخزنك مليان والحمد لله، مفيش حاجة ناقصة." : "Stock is healthy!";

        let msg = isArabic ? "الأصناف دي قربت تخلص:\n" : "These items are running out:\n";
        products.forEach(p => {
            const qty = p.stocks[0]?.quantity || 0;
            msg += `- ${p.name}: (${qty}) ${isArabic ? 'قطعة' : 'pcs'}\n`;
        });
        return msg;
    }

    private static async getTopProducts(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const top = await db.saleItem.groupBy({
            by: ['productId'],
            where: { sale: { tenantId, status: "COMPLETED" } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        if (top.length === 0) return isArabic ? "مفيش بيانات كافية" : "No data";

        const products = await db.product.findMany({ where: { id: { in: top.map(i => i.productId) } } });
        let msg = isArabic ? "**أكثر حاجات بتبيعها:**\n" : "**Best Sellers:**\n";
        top.forEach((item, idx) => {
            const p = products.find(x => x.id === item.productId);
            msg += `${idx + 1}. ${p?.name} (${item._sum.quantity})\n`;
        });
        return msg;
    }

    private static async getCustomerStats(tenantId: string, isArabic: boolean, dialect: Dialect): Promise<string> {
        const total = await db.customer.count({ where: { tenantId } });
        return isArabic ? `عندك ${total} عميل في النظام.` : `You have ${total} customers.`;
    }

    private static containsArabic(text: string): boolean {
        return /[\u0600-\u06FF]/.test(text);
    }

    private static matches(query: string, keywords: string[]): boolean {
        return keywords.some(k => query.includes(k.toLowerCase()));
    }

    private static async queryAIKnowledge(query: string, tenantId: string): Promise<string | null> {
        try {
            const knowledge = await db.aIKnowledge.findMany({
                where: { OR: [{ tenantId }, { tenantId: null }], isActive: true }
            });
            const match = knowledge.find((k: any) => query.includes(k.question.toLowerCase()) || k.question.toLowerCase().includes(query));
            return match ? match.answer : null;
        } catch (e) { return null; }
    }
}
