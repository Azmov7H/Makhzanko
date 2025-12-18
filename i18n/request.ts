import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
    // Default to Arabic, fallback to English
    const locale = (await cookies()).get('locale')?.value || 
                  (await headers()).get('accept-language')?.split(',')[0]?.split('-')[0] || 
                  'ar';

    return {
        locale: locale === 'ar' ? 'ar' : 'en',
        messages: (await import(`../messages/${locale === 'ar' ? 'ar' : 'en'}.json`)).default
    };
});
