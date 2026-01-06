"use client";

import Barcode from 'react-barcode';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface BarcodeLabelProps {
    name: string;
    sku: string;
    price: string | number;
    currency: string;
}

export function BarcodeLabel({ name, sku, price, currency }: BarcodeLabelProps) {
    const { t } = useI18n();
    const handlePrint = () => {
        window.print();
    };

    return (
        <Card className="max-w-md mx-auto border-none shadow-3xl bg-white p-8 rounded-[2rem] print:p-0 print:border-none print:shadow-none print:rounded-none group hover:scale-[1.02] transition-transform duration-500">
            <CardContent className="flex flex-col items-center gap-6 py-4">
                <div className="text-center">
                    <h3 className="font-black text-2xl mb-1 tracking-tight italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-md w-fit mx-auto">{sku}</p>
                </div>

                <div className="bg-white p-6 border border-primary/5 rounded-2xl overflow-hidden print:border-none print:p-0">
                    <Barcode
                        value={sku}
                        width={1.6}
                        height={70}
                        fontSize={14}
                        fontOptions="bold"
                        background="transparent"
                    />
                </div>

                <div className="text-3xl font-black text-primary tracking-tighter">
                    {Number(price).toLocaleString()} <span className="text-sm uppercase ml-1 opacity-50">{currency}</span>
                </div>

                <Button
                    onClick={handlePrint}
                    className="w-full h-14 rounded-2xl gap-3 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 transition-all hover:scale-105 print:hidden group/btn"
                >
                    <Printer className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    {t("Inventory.print_barcode")}
                </Button>
            </CardContent>
        </Card>
    );
}
