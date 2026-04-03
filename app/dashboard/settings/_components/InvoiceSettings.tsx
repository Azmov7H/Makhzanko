"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth/AuthContext";
import { Save, Eye, Palette, Building2, Settings2, Sparkles, Smartphone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

/* ================= TYPES ================= */

export interface InvoiceSettingsState {
  primaryColor: string;
  accentColor: string;
  fontFamily?: string;
  templateStyle: string;
  showTax: boolean;
  showDiscount: boolean;
  showHeader: boolean;
  showFooter: boolean;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTaxId: string;
  footerNotes: string;
}

interface InvoiceSettingsProps {
  settings: InvoiceSettingsState;
  locale: string;
}

/* ================= COMPONENT ================= */

export function InvoiceSettings({
  settings: initialSettings,
  locale,
}: InvoiceSettingsProps) {
  const { t } = useI18n();

  const [settings, setSettings] = useState<InvoiceSettingsState>(initialSettings);
  const [loading, setLoading] = useState(false);

  /* ================= DERIVED STATE ================= */

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings]
  );

  /* ================= HELPERS ================= */

  const updateField = <K extends keyof InvoiceSettingsState>(
    key: K,
    value: InvoiceSettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (settings.companyEmail && !settings.companyEmail.includes("@")) {
      toast.error(t("Settings.invoice.invalid_email") || "Invalid email address");
      return false;
    }
    if (!settings.primaryColor || !settings.accentColor) {
      toast.error(t("Settings.invoice.invalid_colors") || "Colors are required");
      return false;
    }
    return true;
  };

  /* ================= ACTIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const token = getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/invoice`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...settings,
          fontFamily: settings.fontFamily ?? undefined,
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update settings");
      }

      toast.success(t("Settings.invoice.updated_success") || "Settings updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col xl:flex-row gap-8 items-start max-w-[1600px] mx-auto"
    >
      {/* Left side: Controls */}
      <div className="flex-1 w-full space-y-8">
        {/* Branding section */}
        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                <Palette className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black italic flex items-center gap-2">
                  {t("Settings.invoice.branding")}
                  <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-base font-medium mt-1">
                  {t("Settings.invoice.branding_desc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                {t("Settings.invoice.primary_color")}
              </Label>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl border border-primary/10 shadow-lg cursor-pointer overflow-hidden relative group/color"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="font-mono font-bold text-sm tracking-wider">{settings.primaryColor.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                {t("Settings.invoice.accent_color")}
              </Label>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl border border-primary/10 shadow-lg cursor-pointer overflow-hidden relative group/color"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="font-mono font-bold text-sm tracking-wider">{settings.accentColor.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                {t("Settings.invoice.font_family")}
              </Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => updateField("fontFamily", value || undefined)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-muted/30 hover:bg-muted/50 transition-all duration-300 font-bold text-lg">
                  <SelectValue placeholder={t("Common.select")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-primary/10 shadow-2xl backdrop-blur-xl">
                  <SelectItem value="Inter" className="font-bold py-3">Inter</SelectItem>
                  <SelectItem value="Roboto" className="font-bold py-3">Roboto</SelectItem>
                  <SelectItem value="Cairo" className="font-bold py-3">Cairo</SelectItem>
                  <SelectItem value="Outfit" className="font-bold py-3">Outfit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Visibility Controls */}
        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-xl shadow-emerald-500/5 group-hover:scale-110 transition-transform duration-500">
                <Settings2 className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black italic">{t("Settings.invoice.visibility")}</CardTitle>
                <CardDescription className="text-base font-medium mt-1">
                  {t("Settings.invoice.visibility_desc") || "Control what to show on your invoices"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid sm:grid-cols-2 gap-6">
            {[
              { key: "showTax", label: "Settings.invoice.show_tax" },
              { key: "showDiscount", label: "Settings.invoice.show_discount" },
              { key: "showHeader", label: "Settings.invoice.show_header" },
              { key: "showFooter", label: "Settings.invoice.show_footer" },
            ].map((item) => (
              <motion.div
                key={item.key}
                variants={itemVariants}
                className="flex items-center justify-between p-5 rounded-[1.5rem] border border-primary/5 bg-muted/20 hover:bg-muted/40 transition-all duration-300 group/item"
              >
                <Label className="text-base font-bold cursor-pointer group-hover/item:text-primary transition-colors">
                  {t(item.label)}
                </Label>
                <Switch
                  checked={settings[item.key as keyof InvoiceSettingsState] as boolean}
                  onCheckedChange={(v) => updateField(item.key as keyof InvoiceSettingsState, v)}
                  className="data-[state=checked]:bg-primary"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="border-none shadow-3xl bg-card/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shadow-xl shadow-blue-500/5 group-hover:scale-110 transition-transform duration-500">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black italic">{t("Settings.invoice.company_info")}</CardTitle>
                <CardDescription className="text-base font-medium mt-1">
                  {t("Settings.invoice.company_info_desc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: "companyAddress", label: "Settings.invoice.company_address", icon: MapPin, placeholder: "e.g. 123 Main St, Cairo" },
                { key: "companyPhone", label: "Settings.invoice.company_phone", icon: Smartphone, placeholder: "e.g. +20123456789" },
                { key: "companyEmail", label: "Settings.invoice.company_email", icon: Mail, placeholder: "e.g. hello@store.com" },
                { key: "companyTaxId", label: "Settings.invoice.tax_id", icon: Settings2, placeholder: "e.g. 123-456-789" },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    {t(field.label)}
                  </Label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors duration-300">
                      <field.icon className="h-4 w-4" />
                    </div>
                    <Input
                      value={settings[field.key as keyof InvoiceSettingsState] as string}
                      onChange={(e) => updateField(field.key as keyof InvoiceSettingsState, e.target.value)}
                      placeholder={field.placeholder}
                      className="h-14 rounded-2xl bg-muted/30 border-primary/10 pl-11 focus:bg-background focus:ring-primary/20 transition-all duration-300 font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                {t("Settings.invoice.footer_notes")}
              </Label>
              <Input
                value={settings.footerNotes}
                onChange={(e) => updateField("footerNotes", e.target.value)}
                placeholder={t("Settings.invoice.footer_placeholder")}
                className="h-14 rounded-2xl bg-muted/30 border-primary/10 focus:bg-background transition-all duration-300 font-bold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={!isDirty || loading}
            className="h-16 px-10 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 font-black text-lg uppercase tracking-widest group/save"
          >
            <Save className="mr-3 h-5 w-5 transition-transform group-hover/save:rotate-12" />
            {loading ? t("Common.loading") : t("Settings.save_changes")}
          </Button>

          <Button
            variant="outline"
            asChild
            className="h-16 px-8 rounded-3xl border-primary/10 bg-background/50 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/20 active:scale-95 transition-all duration-300 font-bold"
          >
            <a href="/dashboard/sales/invoices" target="_blank" rel="noreferrer">
              <Eye className="mr-3 h-5 w-5" />
              {t("Settings.invoice.preview_invoice")}
            </a>
          </Button>
        </div>
      </div>

      {/* Right side: Live Preview Glass Card */}
      <div className="w-full xl:w-[450px] sticky top-8">
        <Card className="border-none shadow-3xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/10">
          <CardHeader className="p-8 bg-primary/5 border-b border-white/5">
            <CardTitle className="text-lg font-black uppercase tracking-tighter text-primary flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("Invoices.designer.preview") || "Live Preview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex justify-center">
            <div
              className="w-full aspect-[1/1.4] bg-white rounded-2xl shadow-inner-xl p-6 flex flex-col scale-100 transition-all duration-500 overflow-hidden"
              style={{ fontFamily: settings.fontFamily }}
            >
              {/* Header */}
              {settings.showHeader && (
                <div className="flex justify-between items-start mb-6 pb-3 border-b-2" style={{ borderColor: settings.primaryColor }}>
                  <div>
                    <div className="h-6 w-16 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-gray-300" />
                    </div>
                    <h1 className="text-xs font-black" style={{ color: settings.primaryColor }}>INVOICE</h1>
                  </div>
                  <div className="text-right">
                    <h2 className="text-[10px] font-black">{t("Landing.brand_name") || "STORE NAME"}</h2>
                    <p className="text-[8px] text-gray-400 font-mono">#INV-001</p>
                  </div>
                </div>
              )}

              {/* Body placeholders */}
              <div className="flex-1 space-y-4 pt-2">
                <div className="h-2 w-1/3 bg-gray-100 rounded" />
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-gray-50 rounded" />
                  <div className="h-1.5 w-full bg-gray-50 rounded" />
                  <div className="h-1.5 w-2/3 bg-gray-50 rounded" />
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-2 w-16 bg-gray-100 rounded" />
                    <div className="h-2 w-12 bg-gray-100 rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-2 w-20 bg-gray-100 rounded" />
                    <div className="h-2 w-14 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>

              {/* Total box */}
              <div
                className="mt-4 p-3 rounded-xl text-white flex justify-between items-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">{t("Invoices.designer.total_amount") || "Total"}</span>
                <span className="text-xs font-black">1,450.00 EGP</span>
              </div>

              {/* Footer */}
              {settings.showFooter && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-[7px] text-gray-400 italic text-center leading-tight">
                    {settings.footerNotes || t("Settings.invoice.footer_placeholder")}
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    <div className="h-2 w-2 bg-primary/10 rounded-full" style={{ backgroundColor: `${settings.accentColor}20` }} />
                    <div className="h-2 w-2 bg-primary/10 rounded-full" style={{ backgroundColor: `${settings.accentColor}20` }} />
                    <div className="h-2 w-2 bg-primary/10 rounded-full" style={{ backgroundColor: `${settings.accentColor}20` }} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Decorative background element */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </motion.div>
  );
}
