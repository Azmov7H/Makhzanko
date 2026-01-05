import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { DEFAULT_ACCOUNTS } from "@/lib/accounting";
import { Role, PlanType, User, Tenant, AccountType } from "@prisma/client";
import { UserSafe } from "@/types/user";

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    companyName: string;
}

export class AuthService {
    static async register({ name, email, password, companyName }: RegisterInput): Promise<{ user: UserSafe & { tenant: Tenant }; tenant: Tenant }> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const slug = companyName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

        return await prisma.$transaction(async (tx) => {
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 90); // 3 months free trial

            const tenant = await tx.tenant.create({
                data: {
                    name: companyName,
                    slug,
                    plan: "BUSINESS", // Full access during trial
                    trialEndsAt,
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    name,
                    role: "OWNER",
                    tenantId: tenant.id,
                },
            });

            await tx.account.createMany({
                data: DEFAULT_ACCOUNTS.map(account => ({
                    tenantId: tenant.id,
                    code: account.code,
                    name: account.name,
                    type: account.type,
                })),
                skipDuplicates: true,
            });

            const { passwordHash, ...safeUser } = user;
            const userWithTenant = { ...safeUser, tenant };
            return { user: userWithTenant as UserSafe & { tenant: Tenant }, tenant };
        }, {
            maxWait: 20000,
            timeout: 20000,
        });
    }

    static async authenticate({ email, password }: any): Promise<UserSafe & { tenant: { id: string; plan: PlanType } }> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                tenant: {
                    select: {
                        id: true,
                        plan: true
                    }
                }
            }
        });

        if (!user || !user.isActive || user.deletedAt) {
            throw new Error("Invalid credentials or account disabled");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const { passwordHash, ...safeUser } = user;
        return safeUser as UserSafe & { tenant: { id: string; plan: PlanType } };
    }

    static async createSessionToken(user: UserSafe & { tenant: { plan: PlanType } }) {
        return await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            plan: user.tenant.plan,
        });
    }
}
