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
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createPlatformAdminAction } from "@/actions/admin/admin-management";
import { toast } from "sonner";
import { UserPlus, Shield } from "lucide-react";

const adminSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    role: z.enum(["SUPER", "SUPPORT", "FINANCE"]),
});

export function AdminForm({ locale }: { locale: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof adminSchema>>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            username: "",
            name: "",
            password: "",
            role: "SUPPORT",
        },
    });

    async function onSubmit(values: z.infer<typeof adminSchema>) {
        setIsLoading(true);
        try {
            const result = await createPlatformAdminAction(values);
            if (result.success) {
                toast.success("تمت إضافة المدير بنجاح");
                form.reset();
            } else {
                toast.error("فشل في إضافة المدير");
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: أحمد محمد" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                                <Input placeholder="ahmed_support" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>الدور الصلاحيات</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="SUPER">مدير كامل (SUPER)</SelectItem>
                                    <SelectItem value="SUPPORT">دعم فني (SUPPORT)</SelectItem>
                                    <SelectItem value="FINANCE">مالي (FINANCE)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-[10px]">
                                الأدوار تحدد الأقسام التي يمكن للمدير الوصول إليها.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full gap-2 font-bold" disabled={isLoading}>
                    <UserPlus className="h-4 w-4" />
                    {isLoading ? "جاري الإضافة..." : "حفظ بيانات المدير"}
                </Button>
            </form>
        </Form>
    );
}
