"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateInvoiceSettingsAction } from "@/actions/invoice-settings";
import { FileText, Save, Layout, Type, Palette, Eye } from "lucide-react";

interface InvoiceSettingsProps {
    settings: any;
}

export function InvoiceSettings({ settings: initialSettings }: InvoiceSettingsProps) {
    const { t } = useI18n();

    const handleSave = async () => {
        setLoading(true);
        const result = await updateInvoiceSettingsAction(settings);
        setLoading(false);

        if (result.success) {
            toast({
                title: t("Settings.invoice.updated_success"),
                description: t("Settings.invoice.updated_desc"),
            });
        } else {
            toast({
                variant: "destructive",
                title: t("Common.error"),
                description: result.error || t("Common.error"),
            });
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2 text-start">
            <div className="space-y-8">
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 py-6 px-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Palette className="h-5 w-5 text-primary" />
                            </div>
                            {t("Settings.invoice.branding")}
                        </CardTitle>
                        <CardDescription className="font-medium">{t("Settings.invoice.branding_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 px-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.primary_color")}</Label>
                                <div className="flex gap-3">
                                    <Input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="w-14 h-11 p-1 rounded-xl cursor-pointer border-primary/10"
                                    />
                                    <Input
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/50 border-primary/10 font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.accent_color")}</Label>
                                <div className="flex gap-3">
                                    <Input
                                        type="color"
                                        value={settings.accentColor}
                                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                        className="w-14 h-11 p-1 rounded-xl cursor-pointer border-primary/10"
                                    />
                                    <Input
                                        value={settings.accentColor}
                                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/50 border-primary/10 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.font_family")}</Label>
                                <Select value={settings.fontFamily} onValueChange={(v) => setSettings({ ...settings, fontFamily: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-primary/10">
                                        <SelectValue placeholder={t("Settings.invoice.font_placeholder")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-primary/10">
                                        <SelectItem value="Inter">Inter</SelectItem>
                                        <SelectItem value="Roboto">Roboto</SelectItem>
                                        <SelectItem value="Tajawal">Tajawal (Arabic)</SelectItem>
                                        <SelectItem value="Cairo">Cairo (Arabic)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.template_style")}</Label>
                                <Select value={settings.templateStyle} onValueChange={(v) => setSettings({ ...settings, templateStyle: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-primary/10">
                                        <SelectValue placeholder={t("Settings.invoice.style_placeholder")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-primary/10">
                                        <SelectItem value="modern">{t("Settings.invoice.modern")}</SelectItem>
                                        <SelectItem value="classic">{t("Settings.invoice.classic")}</SelectItem>
                                        <SelectItem value="minimal">{t("Settings.invoice.minimal")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-accent/5 border-b border-primary/5 py-6 px-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <div className="p-2 bg-accent/10 rounded-xl">
                                <Layout className="h-5 w-5 text-accent" />
                            </div>
                            {t("Settings.invoice.visibility")}
                        </CardTitle>
                        <CardDescription className="font-medium">{t("Settings.invoice.visibility_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 px-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/10 transition-colors">
                                <Label htmlFor="show-tax" className="font-bold cursor-pointer">{t("Settings.invoice.show_tax")}</Label>
                                <Switch id="show-tax" checked={settings.showTax} onCheckedChange={(v) => setSettings({ ...settings, showTax: v })} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/10 transition-colors">
                                <Label htmlFor="show-discount" className="font-bold cursor-pointer">{t("Settings.invoice.show_discount")}</Label>
                                <Switch id="show-discount" checked={settings.showDiscount} onCheckedChange={(v) => setSettings({ ...settings, showDiscount: v })} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/10 transition-colors">
                                <Label htmlFor="show-header" className="font-bold cursor-pointer">{t("Settings.invoice.show_header")}</Label>
                                <Switch id="show-header" checked={settings.showHeader} onCheckedChange={(v) => setSettings({ ...settings, showHeader: v })} />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5 hover:border-primary/10 transition-colors">
                                <Label htmlFor="show-footer" className="font-bold cursor-pointer">{t("Settings.invoice.show_footer")}</Label>
                                <Switch id="show-footer" checked={settings.showFooter} onCheckedChange={(v) => setSettings({ ...settings, showFooter: v })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 py-6 px-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            {t("Settings.invoice.company_info")}
                        </CardTitle>
                        <CardDescription className="font-medium">{t("Settings.invoice.company_info_desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 px-8 space-y-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.company_address")}</Label>
                            <Input
                                value={settings.companyAddress}
                                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                                placeholder="123 Street, City"
                                className="h-11 rounded-xl bg-muted/50 border-primary/10"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.company_phone")}</Label>
                                <Input
                                    value={settings.companyPhone}
                                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                    placeholder="+123456789"
                                    className="h-11 rounded-xl bg-muted/50 border-primary/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.company_email")}</Label>
                                <Input
                                    value={settings.companyEmail}
                                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                    placeholder="info@company.com"
                                    className="h-11 rounded-xl bg-muted/50 border-primary/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.tax_id")}</Label>
                            <Input
                                value={settings.companyTaxId}
                                onChange={(e) => setSettings({ ...settings, companyTaxId: e.target.value })}
                                placeholder="VAT-123-456"
                                className="h-11 rounded-xl bg-muted/50 border-primary/10"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-sm tracking-tight">{t("Settings.invoice.footer_notes")}</Label>
                            <Input
                                value={settings.footerNotes}
                                onChange={(e) => setSettings({ ...settings, footerNotes: e.target.value })}
                                placeholder={t("Settings.invoice.footer_placeholder")}
                                className="h-11 rounded-xl bg-muted/50 border-primary/10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button onClick={handleSave} disabled={loading} className="flex-1 h-12 rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                        {loading ? t("Common.loading") : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                {t("Settings.save_changes")}
                            </>
                        )}
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl font-black flex-1 border-primary/10 hover:bg-primary/5 transition-all duration-300" asChild>
                        <a href="/dashboard/sales-flow/invoices" target="_blank">
                            <Eye className="mr-2 h-5 w-5" />
                            {t("Settings.invoice.preview_invoice")}
                        </a>
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl font-black flex-1 border-primary/10 hover:bg-primary/5 transition-all duration-300" asChild>
                        <a href="/dashboard/sales-flow/invoices/design">
                            <Palette className="mr-2 h-5 w-5" />
                            {t("Invoices.designer.open_designer")}
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
