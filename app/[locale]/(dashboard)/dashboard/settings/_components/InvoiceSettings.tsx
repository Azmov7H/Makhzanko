"use client";

import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { updateInvoiceSettingsAction } from "@/actions/invoice-settings";
import { Save, Eye } from "lucide-react";

/* ================= TYPES ================= */

export interface InvoiceSettingsState {
    primaryColor: string;
    accentColor: string;
    fontFamily?: string; // Optional
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
}

/* ================= COMPONENT ================= */

export function InvoiceSettings({
    settings: initialSettings,
}: InvoiceSettingsProps) {
    const { t } = useI18n();
    

    const [settings, setSettings] =
        useState<InvoiceSettingsState>(initialSettings);

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
    setLoading(true);

    const result = await updateInvoiceSettingsAction({
        ...settings,
        fontFamily: settings.fontFamily ?? undefined,
    });

    setLoading(false);

    if (result?.success) {
        toast.success(t("Settings.invoice.updated_success"));
    } else {
        toast.error(result?.error ?? t("Common.error"));
    }
};


    return (
        <div className="grid gap-8 lg:grid-cols-2 text-start">
            {/* ================= Branding ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("Settings.invoice.branding")}</CardTitle>
                    <CardDescription>
                        {t("Settings.invoice.branding_desc")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                primaryColor: e.target.value,
                            })
                        }
                    />

                    <Input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                accentColor: e.target.value,
                            })
                        }
                    />

                    <Select
                        value={settings.fontFamily}
                        onValueChange={(value) =>
                            setSettings({
                                ...settings,
                                fontFamily: value || undefined,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Cairo">Cairo</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* ================= Visibility ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("Settings.invoice.visibility")}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Switch
                        checked={settings.showTax}
                        onCheckedChange={(v) =>
                            setSettings({ ...settings, showTax: v })
                        }
                    />

                    <Switch
                        checked={settings.showDiscount}
                        onCheckedChange={(v) =>
                            setSettings({ ...settings, showDiscount: v })
                        }
                    />

                    <Switch
                        checked={settings.showHeader}
                        onCheckedChange={(v) =>
                            setSettings({ ...settings, showHeader: v })
                        }
                    />

                    <Switch
                        checked={settings.showFooter}
                        onCheckedChange={(v) =>
                            setSettings({ ...settings, showFooter: v })
                        }
                    />
                </CardContent>
            </Card>

            {/* ================= Company Info ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("Settings.invoice.company_info")}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input
                        value={settings.companyAddress}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                companyAddress: e.target.value,
                            })
                        }
                    />

                    <Input
                        value={settings.companyPhone}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                companyPhone: e.target.value,
                            })
                        }
                    />

                    <Input
                        value={settings.companyEmail}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                companyEmail: e.target.value,
                            })
                        }
                    />

                    <Input
                        value={settings.companyTaxId}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                companyTaxId: e.target.value,
                            })
                        }
                    />

                    <Input
                        value={settings.footerNotes}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                footerNotes: e.target.value,
                            })
                        }
                    />
                </CardContent>
            </Card>

            {/* ================= Actions ================= */}
            <div className="flex gap-4">
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading
                        ? t("Common.loading")
                        : t("Settings.save_changes")}
                </Button>

                <Button variant="outline" asChild>
                    <a
                        href="/dashboard/sales-flow/invoices"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("Settings.invoice.preview_invoice")}
                    </a>
                </Button>
            </div>
        </div>
    );
}
