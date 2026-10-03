"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  //   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PatientForm } from "./forms/PatientForm";
import { PhysicianForm } from "./forms/PhysicianForm";
import { ConferenceRegistrationForm } from "./forms/ConferenceRegistrationForm";
import { Stethoscope, Users, Calendar } from "lucide-react";

type UserType = "none" | "patient" | "physician" | "conference";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Open straight on the conference form, skipping the Patient / Physician chooser. */
  conferenceOnly?: boolean;
};

const SubscribeModal = ({ isOpen, onClose, conferenceOnly = false }: SubscribeModalProps) => {
  const initialType: UserType = conferenceOnly ? "conference" : "none";
  const [userType, setUserType] = useState<UserType>(initialType);

  const handleReset = () => {
    setUserType(initialType);
  };

  const close = () => {
    onClose();
    setTimeout(handleReset, 300); // Reset after close animation
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[calc(100dvh-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-bold">
            {userType === "conference" ? "Conference Registration" : "Subscribe"}
          </DialogTitle>
          <DialogDescription>
            {userType === "conference"
              ? "Fill in your details to register for the conference."
              : "Choose your subscription type to receive relevant information."}
          </DialogDescription>
        </DialogHeader>

        {userType === "none" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            <Button
              className="h-12 rounded-full bg-secondary text-base text-white hover:bg-secondary/90 active:scale-[0.98]"
              onClick={() => setUserType("patient")}
            >
              <Users /> Patient
            </Button>
            <Button
              className="h-12 rounded-full bg-primary text-base text-white hover:bg-primary/90 active:scale-[0.98]"
              onClick={() => setUserType("physician")}
            >
              <Stethoscope /> Physician
            </Button>
            <Button
              className="h-12 rounded-full bg-primary text-base text-white hover:bg-primary/90 active:scale-[0.98] col-span-1 sm:col-span-2"
              onClick={() => setUserType("conference")}
            >
              <Calendar /> Conference Registration
            </Button>
          </div>
        )}

        {userType === "patient" && <PatientForm onBack={handleReset} />}
        {userType === "physician" && <PhysicianForm onBack={handleReset} />}
        {userType === "conference" && (
          <ConferenceRegistrationForm
            onBack={conferenceOnly ? undefined : handleReset}
            onDone={close}
          />
        )}

        {/* {userType === "none" && (
          <DialogFooter>
            <Button
              //   variant="outline"
              onClick={onClose}
              className="rounded-full bg-destructive text-white hover:bg-destructive/80"
            >
              Cancel
            </Button>
          </DialogFooter>
        )} */}
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
