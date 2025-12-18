"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanType } from "@prisma/client";
import { createTrialOverride } from "@/actions/owner/trials";
import { toast } from "sonner";

interface TrialOverrideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}

export function TrialOverrideDialog({
  open,
  onOpenChange,
  tenantId,
}: TrialOverrideDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [plan, setPlan] = useState<PlanType>(PlanType.PRO);
  const [days, setDays] = useState("30");

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createTrialOverride(tenantId, plan, parseInt(days));
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Trial created for ${days} days`);
        onOpenChange(false);
        setDays("30");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Trial</DialogTitle>
          <DialogDescription>
            Give this tenant a trial period for any plan
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="trial-plan">Plan</Label>
            <Select value={plan} onValueChange={(value) => setPlan(value as PlanType)}>
              <SelectTrigger id="trial-plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlanType.FREE}>FREE</SelectItem>
                <SelectItem value={PlanType.PRO}>PRO</SelectItem>
                <SelectItem value={PlanType.BUSINESS}>BUSINESS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-days">Days</Label>
            <Input
              id="trial-days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              max="365"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            Create Trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

