import { prisma } from "@/lib/prisma";
import { UserSafe } from "@/types/user";
import bcrypt from "bcryptjs";

export interface CreateUserInput {
    email: string;
    name?: string;
    role?: "OWNER" | "ADMIN" | "MANAGER" | "STAFF";
    password?: string;
}

export class UserService {
    static async list(tenantId: string): Promise<UserSafe[]> {
        const users = await prisma.user.findMany({
            where: {
                tenantId,
                deletedAt: null
            },
            orderBy: { name: "asc" }
        });
        return users.map(({ passwordHash, ...u }) => u as UserSafe);
    }

    static async getById(id: string, tenantId: string): Promise<UserSafe | null> {
        const user = await prisma.user.findUnique({
            where: { id, tenantId }
        });
        if (!user) return null;
        const { passwordHash, ...safeUser } = user;
        return safeUser as UserSafe;
    }

    static async create(tenantId: string, data: CreateUserInput): Promise<UserSafe> {
        const hashedPassword = await bcrypt.hash(data.password || "Welcome123!", 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role || "STAFF",
                tenantId,
                passwordHash: hashedPassword,
            },
        });
        const { passwordHash, ...safeUser } = user;
        return safeUser as UserSafe;
    }

    static async update(id: string, tenantId: string, data: any) {
        return await prisma.user.update({
            where: { id, tenantId },
            data,
        });
    }

    static async delete(id: string, tenantId: string) {
        return await prisma.user.update({
            where: { id, tenantId },
            data: { deletedAt: new Date(), isActive: false }
        });
    }
}
