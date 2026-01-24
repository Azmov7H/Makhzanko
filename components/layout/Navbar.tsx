"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";
import { ThemeToggle } from "./Toggel";
import { useI18n } from "@/lib/i18n/context";

export default function Navbar() {
  const { t, locale } = useI18n();

  const links = [
    { id: 1, name: t("Landing.features.title"), href: "/#features" },
    { id: 2, name: t("Landing.pricing.title"), href: "/#pricing" },
    { id: 3, name: t("Landing.footer.support"), href: "/support" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md p-4 md:p-6 transition-colors">
      <div className="container mx-auto flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-all hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <ThemeToggle />
          <LanguageToggle />



          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="flex flex-col gap-8 pt-16">
              <div className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-lg font-bold text-foreground transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <hr className="border-border" />

              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="xl" className="w-full rounded-2xl">
                    {t("Auth.login")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button size="xl" className="w-full rounded-2xl gradient-primary">
                    {t("Auth.register")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
