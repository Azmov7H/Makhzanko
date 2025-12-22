"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createAnnouncementAction } from "@/actions/admin/announcements";
import { toast } from "sonner";
import { Send } from "lucide-react";

const announcementSchema = z.object({
    title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
    content: z.string().min(10, "المحتوى يجب أن يكون 10 أحرف على الأقل"),
    type: z.enum(["INFO", "WARNING", "CRITICAL"]),
    target: z.enum(["ALL", "FREE", "PRO", "BUSINESS"]),
});

export function AnnouncementForm({ locale }: { locale: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof announcementSchema>>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            content: "",
            type: "INFO",
            target: "ALL",
        },
    });

    async function onSubmit(values: z.infer<typeof announcementSchema>) {
        setIsLoading(true);
        try {
            const result = await createAnnouncementAction(values);
            if (result.success) {
                toast.success("تم إرسال الإعلان بنجاح");
                form.reset();
            } else {
                toast.error("فشل في إرسال الإعلان");
            }
        } catch (error) {
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان الإعلان</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: تحديث أمني هام" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>المحتوى</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="اكتب تفاصيل الإعلان هنا..."
                                    className="resize-none h-24"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>النوع</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="INFO">معلومة</SelectItem>
                                        <SelectItem value="WARNING">تنبيه</SelectItem>
                                        <SelectItem value="CRITICAL">هام جداً</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الجمهور المستهدف</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ALL">الكل</SelectItem>
                                        <SelectItem value="FREE">الخطة المجانية</SelectItem>
                                        <SelectItem value="PRO">الباقة الاحترافية</SelectItem>
                                        <SelectItem value="BUSINESS">باقة الأعمال</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full gap-2 font-bold" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    {isLoading ? "جاري الإرسال..." : "بث الإعلان الآن"}
                </Button>
            </form>
        </Form>
    );
}
