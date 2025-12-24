"use client";

import { useI18n } from "@/lib/i18n/context";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import Logo from "./Logo";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
    const { t, locale } = useI18n();
    const currentYear = 2025;

    return (
        <footer className="w-full border-t bg-background pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
                        <Logo />
                        <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                            {t("desc")}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="size-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="size-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="size-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="size-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-6">{t("Landing.footer.quick_links")}</h4>
                        <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">{t("Landing.footer.links.home")}</Link></li>
                            <li><Link href="/#features" className="hover:text-primary transition-colors">{t("Landing.footer.links.features")}</Link></li>
                            <li><Link href="/#pricing" className="hover:text-primary transition-colors">{t("Landing.footer.links.pricing")}</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">{t("Landing.footer.links.login")}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-6">{t("Landing.footer.support")}</h4>
                        <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">{t("Landing.footer.links.faq")}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t("Landing.footer.links.contact_us")}</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors">{t("Landing.footer.links.docs")}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t("Landing.footer.privacy")}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold mb-6">{t("Landing.footer.contact")}</h4>
                        <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                            <li>{t("Landing.footer.links.location")}</li>
                            <li>support@makhzanko.com</li>
                            <li>+20 123 456 7890</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {currentYear} {t("Landing.footer.brand_name")}. {t("Landing.footer.rights")}</p>
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="hover:text-primary transition-colors">{t("Landing.footer.terms")}</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">{t("Landing.footer.privacy")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

