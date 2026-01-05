import { UserService } from "@/services/users";
import { getTenantContext } from "@/lib/auth";
import { UsersClient } from "./_components/UsersClient";

export default async function UsersPage() {
    const context = await getTenantContext();
    const users = await UserService.list(context.tenantId);

    return <UsersClient users={users} />;
}
