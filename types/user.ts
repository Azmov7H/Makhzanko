import { Role } from "@prisma/client";

export interface UserSafe {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    isActive: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
