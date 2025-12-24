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

  const [settings, setSettings] =
    useState<InvoiceSettingsState>(initialSettings);
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
    if (!settings.companyEmail.includes("@")) {
      toast.error(t("Settings.invoice.invalid_email"));
      return false;
    }
    if (!settings.primaryColor || !settings.accentColor) {
      toast.error(t("Settings.invoice.invalid_colors"));
      return false;
    }
    return true;
  };

  /* ================= ACTIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

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

  /* ================= UI ================= */

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
          <div>
            <label className="text-sm font-medium">
              {t("Settings.invoice.primary_color")}
            </label>
            <Input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateField("primaryColor", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {t("Settings.invoice.accent_color")}
            </label>
            <Input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateField("accentColor", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {t("Settings.invoice.font_family")}
            </label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) =>
                updateField("fontFamily", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Common.select")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Cairo">Cairo</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            onCheckedChange={(v) => updateField("showTax", v)}
          />
          <Switch
            checked={settings.showDiscount}
            onCheckedChange={(v) => updateField("showDiscount", v)}
          />
          <Switch
            checked={settings.showHeader}
            onCheckedChange={(v) => updateField("showHeader", v)}
          />
          <Switch
            checked={settings.showFooter}
            onCheckedChange={(v) => updateField("showFooter", v)}
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
            onChange={(e) => updateField("companyAddress", e.target.value)}
          />
          <Input
            value={settings.companyPhone}
            onChange={(e) => updateField("companyPhone", e.target.value)}
          />
          <Input
            value={settings.companyEmail}
            onChange={(e) => updateField("companyEmail", e.target.value)}
          />
          <Input
            value={settings.companyTaxId}
            onChange={(e) => updateField("companyTaxId", e.target.value)}
          />
          <Input
            value={settings.footerNotes}
            onChange={(e) => updateField("footerNotes", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ================= Actions ================= */}
      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={!isDirty || loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? t("Common.loading") : t("Settings.save_changes")}
        </Button>

        <Button variant="outline" asChild>
          <a
            href={`/${locale}/dashboard/sales-flow/invoices`}
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
