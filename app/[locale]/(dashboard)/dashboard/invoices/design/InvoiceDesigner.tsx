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
import { Loader2, Save } from "lucide-react";
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
                        Customize the look of your invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                value={config.primaryColor || "#000000"}
                                onChange={(e) => updateConfig("primaryColor", e.target.value)}
                                disabled={isLocked}
                                className="w-12 h-12 p-1 rounded-md cursor-pointer"
                            />
                            <Input
                                value={config.primaryColor || "#000000"}
                                onChange={(e) => updateConfig("primaryColor", e.target.value)}
                                disabled={isLocked}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                            value={config.fontFamily || "Inter"}
                            onValueChange={(val) => updateConfig("fontFamily", val)}
                            disabled={isLocked}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter">Inter (Sans)</SelectItem>
                                <SelectItem value="Times New Roman">Serif</SelectItem>
                                <SelectItem value="Courier New">Monospace</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
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
                            <Label>Show Warehouse</Label>
                            <Switch checked={config.showWarehouse} onCheckedChange={(c) => updateConfig("showWarehouse", c)} disabled={isLocked} />
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

                    <div className="pt-4">
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
                        className="w-full max-w-[210mm] bg-white shadow-lg p-10 min-h-[297mm] flex flex-col text-sm border"
                        style={{ fontFamily: config.fontFamily }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h1 className="text-3xl font-bold" style={{ color: config.primaryColor }}>INVOICE</h1>
                                <p className="text-gray-500 mt-1">#INV-001</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-bold text-lg">Your Store Name</h2>
                                {config.showSeller && (
                                    <div className="text-gray-500 mt-1 space-y-0.5">
                                        <p>123 Business Rd</p>
                                        <p>City, Country</p>
                                        <p>email@store.com</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-10 p-4 rounded-md bg-gray-50">
                            <p className="font-bold text-gray-700">Bill To:</p>
                            <p className="mt-1">John Doe</p>
                            <p className="text-gray-500">client@example.com</p>
                        </div>

                        {/* Items Table */}
                        <div className="flex-1">
                            <table className="w-full text-left">
                                <thead className="border-b-2" style={{ borderColor: config.primaryColor }}>
                                    <tr>
                                        <th className="py-2">Item</th>
                                        <th className="py-2 text-right">Qty</th>
                                        <th className="py-2 text-right">Price</th>
                                        <th className="py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="py-3">iPhone 15 Pro Max <div className="text-xs text-gray-400">SKU-123</div></td>
                                        <td className="py-3 text-right">1</td>
                                        <td className="py-3 text-right">$1,200.00</td>
                                        <td className="py-3 text-right">$1,200.00</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3">Screen Protector</td>
                                        <td className="py-3 text-right">2</td>
                                        <td className="py-3 text-right">$20.00</td>
                                        <td className="py-3 text-right">$40.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-10 border-t pt-4 flex justify-end">
                            <div className="w-1/2 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>$1,240.00</span>
                                </div>
                                {config.showDiscount && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-$0.00</span>
                                    </div>
                                )}
                                {config.showTax && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tax (15%)</span>
                                        <span>$186.00</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t pt-2" style={{ color: config.primaryColor }}>
                                    <span>Total</span>
                                    <span>$1,426.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-10 text-center text-gray-500 text-xs border-t">
                            <p>{config.footerNotes || "Thank you for your business!"}</p>
                            {config.showWarehouse && <p className="mt-1">Fulfilled by: Main Warehouse</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
