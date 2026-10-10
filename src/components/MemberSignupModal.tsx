"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { MemberSignupForm } from "./forms/MemberSignupForm";

interface Props {
    open: boolean;
    onClose: () => void;
}

// The application form alone. There is no member login to go with it: that route and the
// member dashboard were removed, and a login form here could only ever fail.
export default function MemberSignupModal({ open, onClose }: Props) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) onClose();
            }}
        >
            <DialogContent className="sm:max-w-md max-h-[85dvh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Membership application</DialogTitle>
                    <DialogDescription>
                        For physicians who would like to join the society.
                    </DialogDescription>
                </DialogHeader>

                <MemberSignupForm onSuccess={onClose} />
            </DialogContent>
        </Dialog>
    );
}
