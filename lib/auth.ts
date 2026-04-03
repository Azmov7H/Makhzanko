// DUMMY AUTH COMPATIBILITY LAYER
// This file exists temporarily to prevent build errors in legacy Server Components.
// All pages importing getTenantContext must be converted to Client Components using useAuth().

export const getTenantContext = async () => {
    console.warn("[SPA Migration] Called getTenantContext() on the server. This is obsolete. Migrate to useAuth() on the client.");
    // Return a dummy context to prevent immediate crashes in legacy Server Components
    return {
        tenantId: "migrating_to_spa",
        role: "USER"
    };
};
