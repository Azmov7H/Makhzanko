// DUMMY PRISMA OBJECT
// This file exists temporarily to prevent build errors in legacy Server Components.
// All pages importing this must be converted to Client Components fetching from the Rust REST API.

export const prisma = new Proxy({}, {
    get: function(target, prop) {
        return function() {
            console.warn(`[SPA Migration] Attempted to call prisma.${String(prop)}(). This is a legacy call that must be migrated to the Rust API.`);
            return Promise.resolve([]);
        }
    }
}) as any;

export const db = prisma;
