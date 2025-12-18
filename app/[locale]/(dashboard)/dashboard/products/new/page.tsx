"use client";

import { createProductAction } from "@/actions/products";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProductPage() {
    const [state, action, isPending] = useActionState(createProductAction, null);

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        {state?.error && (
                            <div className="rounded bg-red-50 p-3 text-sm text-red-700">
                                {state.error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" type="text" required placeholder="e.g. iPhone 15" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" name="sku" type="text" required placeholder="e.g. IP15-BLK" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (Selling)</Label>
                                <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cost">Cost (Purchase)</Label>
                                <Input id="cost" name="cost" type="number" step="0.01" required placeholder="0.00" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Create Product"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
