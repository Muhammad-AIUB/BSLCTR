"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Subscriptions have nowhere to be stored yet, so the Subscribe buttons open a notice and
// not a form: asking for someone's details and then discarding them is worse than not
// asking. Conference registration is saved, and has a page of its own to send people to.
const SubscribeModal = ({ isOpen, onClose }: SubscribeModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[calc(100dvh-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-bold">Subscribe</DialogTitle>
          <DialogDescription>Subscriptions are not open yet.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            asChild
            className="h-11 rounded-full bg-secondary px-5 text-white hover:bg-secondary/90"
          >
            {/* The layout that holds this dialog survives navigation, so the link closes
                it: left open, it would sit over the registration page. */}
            <Link href="/bslctrcon/register" onClick={onClose}>
              <Calendar /> Register for the conference
            </Link>
          </Button>
          <Button variant="outline" className="h-11 rounded-full px-5" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
