"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";
import { ThemeDropdown } from "./Toggel";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { id: 1, name: t("Landing.features.title"), href: "/#features" },
    { id: 2, name: t("Landing.faq.title"), href: "/#faq" },
    { id: 3, name: t("Landing.footer.support"), href: "/support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">

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
              className="text-sm font-semibold text-muted-foreground/80 transition-colors hover:text-primary relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeDropdown />
          <LanguageToggle />

          <div className="hidden md:flex items-center gap-3 ml-2 rtl:ml-0 rtl:mr-2">
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-xl gradient-primary shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  {t("Dashboard.dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl font-semibold">
                    {t("Auth.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl gradient-primary shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    {t("Auth.register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="flex flex-col gap-8 pt-16">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-lg font-bold text-foreground transition-colors hover:text-primary min-h-[44px] flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <hr className="border-border" />

              <div className="flex flex-col gap-4">
                {user ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button size="xl" className="w-full rounded-2xl gradient-primary shadow-lg shadow-primary/20">
                      {t("Dashboard.dashboard")}
                    </Button>
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
