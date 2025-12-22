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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, X, ArrowDown, ArrowUp, Calendar, Gift } from "lucide-react";
import { PlanType } from "@prisma/client";
import {
  cancelSubscription,
  forceChangePlan,
  extendSubscriptionPeriod,
} from "@/actions/admin/subscriptions";
import { toast } from "sonner";
import { TrialOverrideDialog } from "./TrialOverrideDialog";

interface SubscriptionActionsProps {
  subscription: {
    id: string;
    status: string;
    tenantId: string;
  };
  tenantId: string;
}

export function SubscriptionActions({ subscription, tenantId }: SubscriptionActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showTrialDialog, setShowTrialDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.FREE);
  const [days, setDays] = useState("30");

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelSubscription(subscription.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Subscription canceled");
        setShowCancelDialog(false);
      }
    });
  };

  const handleChangePlan = () => {
    startTransition(async () => {
      const result = await forceChangePlan(tenantId, selectedPlan);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Plan changed");
        setShowPlanDialog(false);
      }
    });
  };

  const handleExtend = () => {
    startTransition(async () => {
      const result = await extendSubscriptionPeriod(subscription.id, parseInt(days));
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Period extended by ${days} days`);
        setShowExtendDialog(false);
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
          <DropdownMenuItem onClick={() => setShowTrialDialog(true)}>
            <Gift className="mr-2 h-4 w-4" />
            Create Trial
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowPlanDialog(true)}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Change Plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowExtendDialog(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Extend Period
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {subscription.status !== "canceled" && (
            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TrialOverrideDialog
        open={showTrialDialog}
        onOpenChange={setShowTrialDialog}
        tenantId={tenantId}
      />

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this subscription? The tenant will be moved to FREE plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Manually change the tenant plan (bypasses Stripe)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={selectedPlan}
              onValueChange={(value) => setSelectedPlan(value as PlanType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlanType.FREE}>FREE</SelectItem>
                <SelectItem value={PlanType.PRO}>PRO</SelectItem>
                <SelectItem value={PlanType.BUSINESS}>BUSINESS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePlan} disabled={isPending}>
              Change Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Subscription Period</DialogTitle>
            <DialogDescription>
              Add days to the current subscription period
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input
                id="days"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtend} disabled={isPending}>
              Extend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

