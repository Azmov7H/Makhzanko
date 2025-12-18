import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const t = useTranslations('HomePage');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button>{t('login')}</Button>
                </Link>
                <Link href="/register">
                    <Button variant="outline">{t('register')}</Button>
                </Link>
            </div>
        </div>
    );
}
