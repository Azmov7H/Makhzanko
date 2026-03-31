import { prisma } from "@/lib/prisma";

export const NotificationService = {
    async getByTenant(tenantId: string, userId?: string, limit = 50) {
        return await prisma.notification.findMany({
            where: {
                tenantId,
                OR: [
                    { userId: null },
                    { userId: userId }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    },

    async getUnreadCount(tenantId: string, userId?: string) {
        return await prisma.notification.count({
            where: {
                tenantId,
                status: 'unread',
                OR: [
                    { userId: null },
                    { userId: userId }
                ]
            }
        });
    },

    async create(data: {
        tenantId: string;
        userId?: string;
        title: string;
        message: string;
        type?: string;
        link?: string;
    }) {
        return await prisma.notification.create({
            data: {
                ...data,
                status: 'unread'
            }
        });
    },

    async markAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { status: 'read' }
        });
    },

    async markAllAsRead(tenantId: string, userId?: string) {
        return await prisma.notification.updateMany({
            where: {
                tenantId,
                status: 'unread',
                OR: [
                    { userId: null },
                    { userId: userId }
                ]
            },
            data: { status: 'read' }
        });
    },

    async delete(id: string) {
        return await prisma.notification.delete({
            where: { id }
        });
    }
};
