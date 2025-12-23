"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPaymobCheckoutSession, initiatePaymobWalletPayment } from "@/actions/paymob-billing";
import { CreditCard, Smartphone, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethodSelectorProps {
    planId: string;
    planName: string;
    price: number;
    disabled?: boolean;
    buttonText?: string;
}

export function PaymentMethodSelector({
    planId,
    planName,
    price,
    disabled,
    buttonText = "Upgrade"
}: PaymentMethodSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleCardPayment = () => {
        startTransition(async () => {
            try {
                await createPaymobCheckoutSession(planId);
            } catch (error) {
                toast.error("Failed to start card payment");
            }
        });
    };

    const handleWalletPayment = () => {
        if (!phoneNumber || phoneNumber.length < 11) {
            toast.error("Please enter a valid phone number");
            return;
        }

        startTransition(async () => {
            try {
                const result = await initiatePaymobWalletPayment(planId, phoneNumber);
                if (result && 'error' in result) {
                    toast.error(result.error);
                    console.error(result.error);
                }
            } catch (error) {
                toast.error("An unexpected error occurred");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={disabled}>
                    {buttonText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose Payment Method</DialogTitle>
                    <DialogDescription>
                        Upgrade to {planName} plan for {price} EGP/month.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="wallet" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="wallet">Mobile Wallet</TabsTrigger>
                        <TabsTrigger value="card">Credit Card</TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallet" className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50">
                            <Smartphone className="h-10 w-10 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground text-center">
                                Vodafone Cash, Orange Cash, Etisalat Cash, WePay
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Wallet Number</Label>
                            <Input
                                id="phone"
                                placeholder="010xxxxxxxx"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="tel"
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleWalletPayment}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Pay with Wallet
                        </Button>
                    </TabsContent>

                    <TabsContent value="card" className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50">
                            <CreditCard className="h-10 w-10 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground text-center">
                                Visa, Mastercard
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            You will be redirected to a secure payment page.
                        </p>
                        <Button
                            className="w-full"
                            onClick={handleCardPayment}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Proceed to Payment
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
