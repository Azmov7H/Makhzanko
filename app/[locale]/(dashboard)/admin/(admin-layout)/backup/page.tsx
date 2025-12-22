import { requireOwner } from "@/lib/auth-role";
import { getI18n } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/config";
import { Database, Download, CloudUpload, History, Server, ShieldCheck, FileJson, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackupControls } from "./BackupControls";

export default async function AdminBackupPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    await requireOwner();
    const t = await getI18n(locale as Locale);

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                        <Database className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        النسخ الاحتياطي وتصدير البيانات
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    إدارة أمان البيانات وتصدير ملفات المنصة للاستخدام الخارجي.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Backup Section */}
                <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-primary" />
                            نسخ احتياطي شامل
                        </CardTitle>
                        <CardDescription>إنشاء نسخة احتياطية لكافة قواعد البيانات والملفات.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-100">
                            <ShieldCheck className="h-5 w-5" />
                            <div className="text-sm">
                                <p className="font-bold">حماية البيانات مفعلة</p>
                                <p className="opacity-80">يتم أخذ نسخ احتياطية تلقائية كل 24 ساعة.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <History className="h-4 w-4" />
                                آخر العمليات
                            </h4>
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg bg-background">
                                                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                            <span>نسخة احتياطية كاملة #{i * 452}</span>
                                        </div>
                                        <Badge variant="secondary">منذ {i} يوم</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <BackupControls />
                    </CardFooter>
                </Card>

                {/* Export Section */}
                <Card className="border-none shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-accent" />
                            تصدير البيانات
                        </CardTitle>
                        <CardDescription>تحميل بيانات المؤسسات والمستخدمين بصيغ عالمية.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <Button variant="outline" className="h-auto py-4 justify-between gap-4 rounded-2xl group hover:border-primary/50 transition-all">
                                <div className="flex items-center gap-4 text-right">
                                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileJson className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">قائمة المنظمات (JSON)</p>
                                        <p className="text-xs text-muted-foreground">تصدير كافة بيانات المشتركين والخطط.</p>
                                    </div>
                                </div>
                                <Download className="h-5 w-5 text-muted-foreground" />
                            </Button>

                            <Button variant="outline" className="h-auto py-4 justify-between gap-4 rounded-2xl group hover:border-emerald-500/50 transition-all">
                                <div className="flex items-center gap-4 text-right">
                                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <FileSpreadsheet className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">تقرير النشاط (Excel)</p>
                                        <p className="text-xs text-muted-foreground">تصدير سجلات العمليات للتحليل المالي.</p>
                                    </div>
                                </div>
                                <Download className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
