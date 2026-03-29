import StructuredData from "./StructuredData";
import { seoConfig } from "@/lib/seo/config";

export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": seoConfig.organization.name,
        "alternateName": seoConfig.organization.legalName,
        "url": seoConfig.siteUrl,
        "logo": `${seoConfig.siteUrl}${seoConfig.logo}`,
        "foundingDate": seoConfig.organization.foundingDate,
        "sameAs": [
            seoConfig.social.facebook,
            seoConfig.social.twitter,
            seoConfig.social.linkedin
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": seoConfig.organization.phone,
            "contactType": "customer support",
            "email": seoConfig.organization.email,
            "areaServed": ["EG", "SA", "AE"],
            "availableLanguage": ["en", "ar"]
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": seoConfig.organization.address.streetAddress,
            "addressLocality": seoConfig.organization.address.addressLocality,
            "postalCode": seoConfig.organization.address.postalCode,
            "addressCountry": seoConfig.organization.address.addressCountry
        }
    };

    return <StructuredData data={schema} />;
}
