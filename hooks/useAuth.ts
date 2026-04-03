"use client";

/**
 * Re-export from the centralized AuthContext.
 *
 * All auth state is now shared via React Context (AuthProvider).
 * Import `useAuth` for the hook, or `getAuthToken` for the standalone reader.
 */
export { useAuth, getAuthToken, setAuthToken, clearAuthToken } from "@/lib/auth/AuthContext";
