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

// The society's conference banner, 1200 x 341, shown as the registration form's letterhead.
const CONFERENCE_BANNER = "/bslctrcon/registration-banner.webp";

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
      <DialogContent
        className="sm:max-w-[500px] overflow-y-auto max-h-[calc(100dvh-2rem)]"
        // Over the banner the close button gets a white disc, or its red cross is lost
        // against the picture.
        closeClassName={
          registering
            ? "top-3 right-3 rounded-full bg-white p-1 opacity-100 shadow-md data-[state=open]:bg-white"
            : undefined
        }
      >
        {registering && (
          // Edge to edge across the top of the dialog, which clips it to its own corners.
          <div className="-mx-6 -mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CONFERENCE_BANNER}
              alt="BSLCTR CON 2026, 5th International Annual Conference. 22 December 2026, Pan Pacific Sonargaon, Dhaka, Bangladesh. Bangladesh Society for Liver Cancer Treatment & Research."
              width={1200}
              height={341}
              className="block h-auto w-full"
            />
          </div>
        )}

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
