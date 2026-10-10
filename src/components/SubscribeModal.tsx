"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConferenceRegistrationForm } from "./forms/ConferenceRegistrationForm";
import { Calendar } from "lucide-react";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Open straight on the conference form, skipping the subscribe notice. */
  conferenceOnly?: boolean;
};

// Subscriptions have nowhere to be stored yet, so the Subscribe buttons open a notice and
// not a form: asking for someone's details and then discarding them is worse than not
// asking. Conference registration is saved, and stays reachable from here.
const SubscribeModal = ({ isOpen, onClose, conferenceOnly = false }: SubscribeModalProps) => {
  const [registering, setRegistering] = useState(conferenceOnly);

  // Every opening starts from the same place, whatever was showing when it last closed.
  useEffect(() => {
    if (isOpen) setRegistering(conferenceOnly);
  }, [isOpen, conferenceOnly]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[calc(100dvh-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-bold">
            {registering ? "Conference Registration" : "Subscribe"}
          </DialogTitle>
          <DialogDescription>
            {registering
              ? "Fill in your details to register for the conference."
              : "Subscriptions are not open yet."}
          </DialogDescription>
        </DialogHeader>

        {registering ? (
          <ConferenceRegistrationForm
            onBack={conferenceOnly ? undefined : () => setRegistering(false)}
            onDone={onClose}
          />
        ) : (
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              className="h-11 rounded-full bg-secondary px-5 text-white hover:bg-secondary/90"
              onClick={() => setRegistering(true)}
            >
              <Calendar /> Register for the conference
            </Button>
            <Button variant="outline" className="h-11 rounded-full px-5" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
