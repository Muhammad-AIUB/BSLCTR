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
import { Stethoscope, Users } from "lucide-react";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type UserType = "none" | "patient" | "physician";

const SubscribeModal = ({ isOpen, onClose }: SubscribeModalProps) => {
  const [userType, setUserType] = useState<UserType>("none");

  const handleReset = () => {
    setUserType("none");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setTimeout(handleReset, 300); // Reset after close animation
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-dvh">
        <DialogHeader>
          <DialogTitle className="font-bold">Subscribe</DialogTitle>
          <DialogDescription>
            Choose your subscription type to receive relevant information.
          </DialogDescription>
        </DialogHeader>

        {userType === "none" && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              //   variant="outline"
              className="h-20 text-lg bg-red-700 text-white hover:bg-red-800 rounded-full"
              onClick={() => setUserType("patient")}
            >
              <Users /> Patient
            </Button>
            <Button
              //   variant="outline"
              className="h-20 text-lg bg-blue-800 text-white hover:bg-blue-900 rounded-full"
              onClick={() => setUserType("physician")}
            >
              <Stethoscope /> Physician
            </Button>
          </div>
        )}

        {userType === "patient" && <PatientForm onBack={handleReset} />}
        {userType === "physician" && <PhysicianForm onBack={handleReset} />}

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
