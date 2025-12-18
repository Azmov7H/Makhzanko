"use client";

import { createInventoryCountAction } from "@/actions/audit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getWarehousesAction } from "@/actions/warehouses"; // Need this action or fetch in component? server actions can't be imported in client if they return non-serializable? Wait, they return JSON.
// But better to fetch warehouses in Server Component page wrapper.

export default function NewAuditPage() {
    // Actually, I should use a Server Component wrapper to fetch warehouses, receiving them as props.
    return <div>Loading...</div>;
}
