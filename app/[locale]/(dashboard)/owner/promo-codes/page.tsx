import { requireOwner } from "@/lib/auth-role";
import { getAllPromoCodes } from "@/actions/owner/promo-codes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PromoCodeActions } from "./PromoCodeActions";
import { GeneratePromoCodeButton } from "./GeneratePromoCodeButton";
import { PlanType } from "@prisma/client";
import { Ticket } from "lucide-react";

export default async function PromoCodesPage() {
    await requireOwner();
    const promoCodes = await getAllPromoCodes();

    const planColors: Record<PlanType, string> = {
        FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        PRO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        BUSINESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };

    const planNames: Record<PlanType, string> = {
        FREE: "مجاني",
        PRO: "احترافي",
        BUSINESS: "أعمال",
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Ticket className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">إدارة أكواد الترويج</h1>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        إنشاء وإدارة أكواد الترقية للخطط المدفوعة
                    </p>
                </div>
                <GeneratePromoCodeButton />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>جميع الأكواد ({promoCodes.length})</CardTitle>
                    <CardDescription>قائمة بجميع أكواد الترويج المُنشأة</CardDescription>
                </CardHeader>
                <CardContent>
                    {promoCodes.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد أكواد ترويج بعد</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>الكود</TableHead>
                                        <TableHead>الخطة</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead>الاستخدامات</TableHead>
                                        <TableHead>ينتهي في</TableHead>
                                        <TableHead>تم الإنشاء</TableHead>
                                        <TableHead className="text-left">الإجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promoCodes.map((code) => (
                                        <TableRow key={code.id}>
                                            <TableCell>
                                                <code className="px-2 py-1 bg-muted rounded font-mono text-sm">
                                                    {code.code}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={planColors[code.planType]}>
                                                    {planNames[code.planType]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {code.isActive ? (
                                                    <Badge variant="default">نشط</Badge>
                                                ) : (
                                                    <Badge variant="secondary">غير نشط</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {code.currentUses}
                                                {code.maxUses && ` / ${code.maxUses}`}
                                            </TableCell>
                                            <TableCell>
                                                {code.expiresAt
                                                    ? new Date(code.expiresAt).toLocaleDateString("ar-SA")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(code.createdAt).toLocaleDateString("ar-SA")}
                                            </TableCell>
                                            <TableCell>
                                                <PromoCodeActions code={code} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
