"use client";

import Barcode from 'react-barcode';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface BarcodeLabelProps {
    name: string;
    sku: string;
    price: string | number;
    currency: string;
}

export function BarcodeLabel({ name, sku, price, currency }: BarcodeLabelProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Card className="max-w-md mx-auto border shadow-none bg-white p-6 print:p-0 print:border-none print:shadow-none">
            <CardContent className="flex flex-col items-center gap-4 py-8">
                <div className="text-center">
                    <h3 className="font-black text-xl mb-1">{name}</h3>
                    <p className="text-sm font-bold text-muted-foreground uppercase">{sku}</p>
                </div>

                <div className="bg-white p-4 border rounded-xl overflow-hidden print:border-none">
                    <Barcode
                        value={sku}
                        width={1.5}
                        height={60}
                        fontSize={14}
                        fontOptions="bold"
                    />
                </div>

                <div className="text-2xl font-black text-primary">
                    {Number(price).toLocaleString()} {currency}
                </div>

                <Button onClick={handlePrint} className="w-full h-12 rounded-xl gap-2 print:hidden">
                    <Printer className="h-4 w-4" />
                    Print Label
                </Button>
            </CardContent>
        </Card>
    );
}
