"use client";

import { useI18n } from "@/lib/i18n/context";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import Logo from "./Logo";
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const { t } = useI18n();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full bg-background pt-24 pb-12 border-t border-border/40">
            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Logo />
                        <p className="text-muted-foreground text-base leading-relaxed max-w-sm font-medium">
                            {t("Landing.footer.desc")}
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="p-2.5 rounded-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:justify-self-center">
                        <h4 className="text-lg font-bold mb-6 tracking-tight text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Landing.footer.quick_links")}</h4>
                        <ul className="space-y-3">
                            {[
                                { name: t("Landing.footer.links.home"), href: "/" },
                                { name: t("Landing.footer.links.features"), href: "/#features" },
                                { name: t("Landing.faq.title"), href: "/#faq" },
                                { name: t("Landing.footer.links.login"), href: "/login" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-muted-foreground/80 hover:text-primary text-sm font-semibold transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="lg:justify-self-center">
                        <h4 className="text-lg font-bold mb-6 tracking-tight text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Landing.footer.support")}</h4>
                        <ul className="space-y-3">
                            {[
                                { name: t("Landing.footer.links.faq"), href: "/faq" },
                                { name: t("Landing.footer.links.contact_us"), href: "/contact" },
                                { name: t("Landing.footer.links.docs"), href: "/docs" },
                                { name: t("Landing.footer.privacy"), href: "/privacy" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-muted-foreground/80 hover:text-primary text-sm font-semibold transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 tracking-tight text-foreground" style={{ fontFamily: "var(--font-amiri), serif" }}>{t("Landing.footer.contact")}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground font-semibold text-sm">
                                <MapPin className="size-4 text-primary mt-1" />
                                <span>{t("Landing.footer.links.location")}</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground font-semibold text-sm">
                                <Mail className="size-4 text-primary" />
                                <span>support@makhzanko.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground font-semibold text-sm">
                                <Phone className="size-4 text-primary" />
                                <span>+20 123 456 7890</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-muted-foreground/60">
                    <p>© {currentYear} {t("Landing.footer.brand_name")}. {t("Landing.footer.rights")}</p>
                    <div className="flex items-center gap-8">
                        <Link href="/terms" className="hover:text-primary transition-colors">{t("Landing.footer.terms")}</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">{t("Landing.footer.privacy")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
