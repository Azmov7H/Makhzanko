"use client";

import { useState, useTransition } from "react";
import { updateInvoiceSettingsAction } from "@/actions/invoice-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Image as ImageIcon, Smartphone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function InvoiceDesigner({ settings, plan }: { settings: any, plan: string }) {
    const [config, setConfig] = useState(settings);
    const [isPending, startTransition] = useTransition();

    const isLocked = plan === "FREE";

    const handleSave = () => {
        if (isLocked) {
            toast.error("Upgrade to Pro to customize invoices.");
            return;
        }

        startTransition(async () => {
            const result = await updateInvoiceSettingsAction(config);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice settings saved");
            }
        });
    };

    const updateConfig = (key: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    const fontSizeMap: Record<string, string> = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base",
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Controls */}
            <Card className="lg:col-span-4 h-full overflow-auto">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Customization</span>
                        {isLocked && <Badge variant="secondary">LOCKED (FREE)</Badge>}
                    </CardTitle>
                    <CardDescription>
                        Professionalize your brand appearance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-20">
                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Branding</Label>

                        <div className="space-y-2">
                            <Label>Logo URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={config.logoUrl || ""}
                                    onChange={(e) => updateConfig("logoUrl", e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    disabled={isLocked}
                                />
                                <div className="h-10 w-10 border rounded flex items-center justify-center bg-gray-50 flex-shrink-0">
                                    {config.logoUrl ? <img src={config.logoUrl} className="max-h-8 max-w-8 object-contain" alt="Logo preview" /> : <ImageIcon className="h-4 w-4 text-gray-400" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="color"
                                        value={config.primaryColor || "#000000"}
                                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                                        disabled={isLocked}
                                        className="w-10 h-10 p-1 cursor-pointer"
                                    />
                                    <span className="text-xs font-mono">{config.primaryColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Accent Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="color"
                                        value={config.accentColor || "#4F46E5"}
                                        onChange={(e) => updateConfig("accentColor", e.target.value)}
                                        disabled={isLocked}
                                        className="w-10 h-10 p-1 cursor-pointer"
                                    />
                                    <span className="text-xs font-mono">{config.accentColor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Font Family</Label>
                                <Select value={config.fontFamily || "Inter"} onValueChange={(val) => updateConfig("fontFamily", val)} disabled={isLocked}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Inter">Inter (Sans)</SelectItem>
                                        <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                        <SelectItem value="'Times New Roman', serif">Serif</SelectItem>
                                        <SelectItem value="'Courier New', monospace">Monospace</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Font Size</Label>
                                <Select value={config.fontSize || "medium"} onValueChange={(val) => updateConfig("fontSize", val)} disabled={isLocked}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Company Info</Label>
                        <div className="space-y-2">
                            <Label>Company Address</Label>
                            <Input
                                value={config.companyAddress || ""}
                                onChange={(e) => updateConfig("companyAddress", e.target.value)}
                                placeholder="123 Street Name, City"
                                disabled={isLocked}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={config.companyPhone || ""}
                                    onChange={(e) => updateConfig("companyPhone", e.target.value)}
                                    placeholder="+1 234 567"
                                    disabled={isLocked}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={config.companyEmail || ""}
                                    onChange={(e) => updateConfig("companyEmail", e.target.value)}
                                    placeholder="billing@company.com"
                                    disabled={isLocked}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visibility Toggles</Label>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Show Tax</Label>
                                <Switch checked={config.showTax} onCheckedChange={(c) => updateConfig("showTax", c)} disabled={isLocked} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Discount</Label>
                                <Switch checked={config.showDiscount} onCheckedChange={(c) => updateConfig("showDiscount", c)} disabled={isLocked} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Seller Info</Label>
                                <Switch checked={config.showSeller} onCheckedChange={(c) => updateConfig("showSeller", c)} disabled={isLocked} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Customer Info</Label>
                                <Switch checked={config.showCustomerSection} onCheckedChange={(c) => updateConfig("showCustomerSection", c)} disabled={isLocked} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Item Sku/Code</Label>
                                <Switch checked={config.showItemCode} onCheckedChange={(c) => updateConfig("showItemCode", c)} disabled={isLocked} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Warehouse</Label>
                                <Switch checked={config.showWarehouse} onCheckedChange={(c) => updateConfig("showWarehouse", c)} disabled={isLocked} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Footer Notes</Label>
                        <Textarea
                            value={config.footerNotes || ""}
                            onChange={(e) => updateConfig("footerNotes", e.target.value)}
                            placeholder="Thank you for your business!"
                            disabled={isLocked}
                            className="h-24 resize-none"
                        />
                    </div>

                    <div className="pt-4 sticky bottom-0 bg-white pb-4 z-10">
                        <Button onClick={handleSave} disabled={isPending || isLocked} className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                        {isLocked && <p className="text-xs text-red-500 mt-2 text-center">Upgrade plan to unlock</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card className="lg:col-span-8 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col h-full overflow-hidden">
                <CardHeader className="border-b bg-white dark:bg-gray-950">
                    <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-8 flex justify-center">
                    <div
                        className={`w-full max-w-[210mm] bg-white shadow-xl p-10 min-h-[297mm] flex flex-col border transition-all ${fontSizeMap[config.fontSize || 'medium']}`}
                        style={{ fontFamily: config.fontFamily }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10 pb-6 border-b-2" style={{ borderColor: config.primaryColor }}>
                            <div>
                                {config.logoUrl ? (
                                    <img src={config.logoUrl} className="h-16 mb-4 object-contain" alt="Store Logo" />
                                ) : (
                                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-lg mb-4 text-gray-400">
                                        <ImageIcon className="h-8 w-8" />
                                    </div>
                                )}
                                <h1 className="text-3xl font-black tracking-tighter" style={{ color: config.primaryColor }}>INVOICE</h1>
                                <p className="text-gray-400 mt-1 font-mono uppercase tracking-widest text-xs">#INV-2024-0042</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-black text-xl">Your Business Name</h2>
                                {config.showSeller && (
                                    <div className="text-gray-500 mt-3 space-y-1">
                                        {config.companyAddress && <p className="flex items-center justify-end gap-1"><MapPin className="h-3 w-3" /> {config.companyAddress}</p>}
                                        {config.companyPhone && <p className="flex items-center justify-end gap-1"><Smartphone className="h-3 w-3" /> {config.companyPhone}</p>}
                                        {config.companyEmail && <p className="flex items-center justify-end gap-1"><Mail className="h-3 w-3" /> {config.companyEmail}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        {config.showCustomerSection && (
                            <div className="mb-10 grid grid-cols-2 gap-8">
                                <div className="p-4 rounded-xl border bg-gray-50/50">
                                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Bill To</p>
                                    <p className="font-bold text-lg">Acme Corporation</p>
                                    <p className="text-gray-600">Robert Johnson</p>
                                    <p className="text-gray-500">robert@acme.com</p>
                                </div>
                                <div className="p-4 rounded-xl border border-dashed text-right">
                                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Issue Date</p>
                                    <p className="font-bold">May 15, 2024</p>
                                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mt-4 mb-2">Due Date</p>
                                    <p className="font-bold">May 30, 2024</p>
                                </div>
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-100/50">
                                        <th className="px-3 py-3 rounded-l-lg">Description</th>
                                        <th className="px-3 py-3 text-right">Quantity</th>
                                        <th className="px-3 py-3 text-right">Unit Price</th>
                                        <th className="px-3 py-3 text-right rounded-r-lg">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-4">
                                            <p className="font-bold">iPhone 15 Pro Max <Badge variant="secondary" className="ml-2 text-[10px] h-4">Natural Titanium</Badge></p>
                                            {config.showItemCode && <p className="text-[10px] text-gray-400 font-mono mt-1">APPL-IP15PM-NT</p>}
                                        </td>
                                        <td className="px-3 py-4 text-right">1</td>
                                        <td className="px-3 py-4 text-right">1,200.00 EGP</td>
                                        <td className="px-3 py-4 text-right font-bold">1,200.00 EGP</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-4">
                                            <p className="font-bold">AppleCare+ <span className="text-gray-400 text-xs font-normal">(2 Years)</span></p>
                                            {config.showItemCode && <p className="text-[10px] text-gray-400 font-mono mt-1">SER-APPLECARE-PM</p>}
                                        </td>
                                        <td className="px-3 py-4 text-right">1</td>
                                        <td className="px-3 py-4 text-right">199.00 EGP</td>
                                        <td className="px-3 py-4 text-right font-bold">199.00 EGP</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-10 flex justify-end">
                            <div className="w-full max-w-[280px] space-y-3">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">1,399.00 EGP</span>
                                </div>
                                {config.showDiscount && (
                                    <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        <span className="text-xs">Discount (10%)</span>
                                        <span className="font-bold">-139.90 EGP</span>
                                    </div>
                                )}
                                {config.showTax && (
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span>VAT (14%)</span>
                                        <span>195.86 EGP</span>
                                    </div>
                                )}
                                <div
                                    className="flex justify-between items-center p-3 rounded-xl text-white shadow-xl"
                                    style={{ backgroundColor: config.primaryColor }}
                                >
                                    <span className="font-bold uppercase tracking-wider text-xs">Total Amount</span>
                                    <span className="font-black text-xl">1,454.96 EGP</span>
                                </div>

                                <div className="text-[10px] text-gray-400 text-center italic mt-1">
                                    Amount in words: One Thousand Four Hundred Fifty Four EGP
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-10 border-t">
                            <div className="flex justify-between items-end">
                                <div className="space-y-4">
                                    {config.footerNotes && (
                                        <div className="max-w-[400px]">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                                            <p className="text-gray-600 italic leading-relaxed">{config.footerNotes}</p>
                                        </div>
                                    )}
                                    {config.showWarehouse && (
                                        <p className="text-[10px] bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-500">
                                            Fulfilled by: <strong>Cairo Logistics Hub</strong>
                                        </p>
                                    )}
                                </div>
                                <div className="text-center w-32 border-t pt-2 border-gray-100">
                                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Authorized Signature</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center gap-4 text-[9px] text-gray-300">
                                <span>Powered by Makhzanko ERP</span>
                                <span>•</span>
                                <span>Secured by Blockchain</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

