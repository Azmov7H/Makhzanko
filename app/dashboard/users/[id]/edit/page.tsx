import { UserService } from "@/services/users";
import { getTenantContext } from "@/lib/auth";
import UserForm from "../../_components/UserForm";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const context = await getTenantContext();
    const user = await UserService.getById(id, context.tenantId);

    if (!user) notFound();

    return <UserForm user={user} />;
}
