"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Edit, Ban, Trash2, LogOut } from "lucide-react";
import { Role } from "@prisma/client";
import { updateUserRole, toggleUserStatus, deleteUser, forceLogoutUser } from "@/actions/admin/users";
import { toast } from "sonner";

interface UserActionsProps {
  user: {
    id: string;
    email: string;
    role: Role;
    isActive: boolean;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);

  const handleRoleChange = () => {
    startTransition(async () => {
      const result = await updateUserRole(user.id, selectedRole);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User role updated");
        setShowRoleDialog(false);
      }
    });
  };

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await toggleUserStatus(user.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`User ${user.isActive ? "deactivated" : "activated"}`);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User deleted");
        setShowDeleteDialog(false);
      }
    });
  };

  const handleForceLogout = () => {
    startTransition(async () => {
      const result = await forceLogoutUser(user.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "User will be logged out");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowRoleDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Change Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Ban className="mr-2 h-4 w-4" />
            {user.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleForceLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Force Logout
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update role for {user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.OWNER}>OWNER</SelectItem>
                <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                <SelectItem value={Role.MANAGER}>MANAGER</SelectItem>
                <SelectItem value={Role.STAFF}>STAFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

