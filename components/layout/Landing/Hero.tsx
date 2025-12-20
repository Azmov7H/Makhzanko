import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations("Landing.hero");

    return (
        <section className="relative w-full overflow-hidden bg-background pt-20 pb-16 md:pt-32 md:pb-32">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] opacity-50" />
            </div>

            <div className="container relative mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col gap-8 text-center lg:text-start animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 self-center lg:self-start px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span>{t("badge")}</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground">
                            {t("title_start")}
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent px-2">
                                {t("title_highlight")}
                            </span>
                            {t("title_end")}
                        </h1>

                        <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                            {t("description")}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button asChild size="xl" className="w-full sm:w-auto gap-2 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                                <Link href="/register">
                                    {t("start_free")}
                                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto px-8 rounded-full hover:bg-muted/50">
                                <Link href="#features">
                                    {t("explore_features")}
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-2">
                            {[
                                t("no_credit"),
                                t("support_24_7"),
                                t("trial_14_days")
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="relative animate-in fade-in zoom-in duration-1000">
                        <div className="relative z-10 p-2 rounded-[2.5rem] border border-border bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Image
                                src="/dashboard-preview.png"
                                alt="Makhzanko Dashboard"
                                width={1200}
                                height={800}
                                className="rounded-[2rem] w-full h-auto object-cover shadow-inner transition-transform duration-700 group-hover:scale-[1.02]"
                                priority
                            />
                        </div>

                        {/* Floating Element 1 */}
                        <div className="absolute -top-6 -right-6 z-20 hidden md:block animate-bounce-slow">
                            <div className="bg-background/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4">
                                <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("floating.total_sales")}</p>
                                    <p className="text-lg font-bold">{t("floating.sales_value")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element 2 */}
                        <div className="absolute -bottom-6 -left-6 z-20 hidden md:block animate-bounce-slow-delay">
                            <div className="bg-background/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("floating.new_customers")}</p>
                                    <p className="text-lg font-bold">{t("floating.customers_value")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


