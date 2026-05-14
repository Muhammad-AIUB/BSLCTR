"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { X, Plus, CheckCircle } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
}

const SPECIALTY_OPTIONS = [
    { value: "hepatologist", label: "Hepatologist" },
    { value: "hepatobiliary_surgeon", label: "Hepatobiliary Surgeon" },
    { value: "intervention_hepatologist", label: "Intervention Hepatologist" },
    { value: "other", label: "Other" },
];

export default function MemberSignupModal({ open, onClose }: Props) {
    const [form, setForm] = useState({
        name: "",
        mobileNo: "",
        email: "",
        bmdcNo: "",
        designation: "",
        specialtySubject: "",
        otherSpecialty: "",
        academicQualifications: "",
        specializedTraining: "",
        currentPosting: "",
        shortBiography: "",
        journals: "",
        profilePicture: "",
        backgroundPicture: "",
    });

    const [chamberAddresses, setChamberAddresses] = useState<string[]>([""]);
    const [interventions, setInterventions] = useState<string[]>([]);
    const [interventionInput, setInterventionInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const isOther = form.specialtySubject === "other";

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const addChamber = () => setChamberAddresses((prev) => [...prev, ""]);
    const updateChamber = (i: number, val: string) =>
        setChamberAddresses((prev) => prev.map((a, idx) => (idx === i ? val : a)));
    const removeChamber = (i: number) =>
        setChamberAddresses((prev) => prev.filter((_, idx) => idx !== i));

    const addIntervention = () => {
        const tag = interventionInput.trim();
        if (tag && !interventions.includes(tag)) {
            setInterventions((prev) => [...prev, tag]);
        }
        setInterventionInput("");
    };
    const removeIntervention = (tag: string) =>
        setInterventions((prev) => prev.filter((t) => t !== tag));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch("/api/member/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    chamberAddresses: chamberAddresses.filter(Boolean),
                    interventions,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSubmitted(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSubmitted(false);
        setError("");
        setForm({
            name: "",
            mobileNo: "",
            email: "",
            bmdcNo: "",
            designation: "",
            specialtySubject: "",
            otherSpecialty: "",
            academicQualifications: "",
            specializedTraining: "",
            currentPosting: "",
            shortBiography: "",
            journals: "",
            profilePicture: "",
            backgroundPicture: "",
        });
        setChamberAddresses([""]);
        setInterventions([]);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">
                        Member Sign Up
                    </DialogTitle>
                </DialogHeader>

                {submitted ? (
                    <div className="flex flex-col items-center gap-4 py-10 text-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h3 className="text-xl font-semibold text-slate-800">
                            Application Submitted!
                        </h3>
                        <p className="text-slate-600 max-w-sm">
                            Your membership application has been received. You will be
                            notified once an admin reviews your application.
                        </p>
                        <Button onClick={handleClose} className="mt-2">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 1. Name */}
                        <div className="space-y-1">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="e.g. Dr. John Doe"
                                required
                            />
                        </div>

                        {/* 2. Mobile No */}
                        <div className="space-y-1">
                            <Label htmlFor="mobileNo">
                                Mobile Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="mobileNo"
                                value={form.mobileNo}
                                onChange={(e) => set("mobileNo", e.target.value)}
                                placeholder="e.g. +8801XXXXXXXXX"
                                required
                            />
                        </div>

                        {/* 3. Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                placeholder="e.g. doctor@hospital.com"
                                required
                            />
                        </div>

                        {/* 4. BMDC No */}
                        <div className="space-y-1">
                            <Label htmlFor="bmdcNo">
                                BMDC Registration No <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="bmdcNo"
                                value={form.bmdcNo}
                                onChange={(e) => set("bmdcNo", e.target.value)}
                                placeholder="e.g. A90809"
                                required
                            />
                        </div>

                        {/* 5. Designation */}
                        <div className="space-y-1">
                            <Label htmlFor="designation">
                                Designation <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="designation"
                                value={form.designation}
                                onChange={(e) => set("designation", e.target.value)}
                                placeholder="e.g. Professor, Associate Professor"
                                required
                            />
                        </div>

                        {/* 6. Specialty Subject */}
                        <div className="space-y-1">
                            <Label>
                                Specialty Subject <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.specialtySubject}
                                onValueChange={(v) => set("specialtySubject", v)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select specialty..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPECIALTY_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isOther && (
                                <Input
                                    className="mt-2"
                                    value={form.otherSpecialty}
                                    onChange={(e) => set("otherSpecialty", e.target.value)}
                                    placeholder="Please specify your specialty"
                                />
                            )}
                        </div>

                        {/* 7. Academic Qualifications */}
                        <div className="space-y-1">
                            <Label htmlFor="academicQualifications">
                                Academic Qualifications / Professional Degrees{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="academicQualifications"
                                value={form.academicQualifications}
                                onChange={(e) => set("academicQualifications", e.target.value)}
                                placeholder="e.g. MD (Hepatology), FCPS (Medicine)"
                                required
                            />
                        </div>

                        {/* 8. Specialized Training */}
                        <div className="space-y-1">
                            <Label htmlFor="specializedTraining">
                                Specialized Training
                            </Label>
                            <Input
                                id="specializedTraining"
                                value={form.specializedTraining}
                                onChange={(e) => set("specializedTraining", e.target.value)}
                                placeholder="e.g. Fellowship in Hepatology, Johns Hopkins"
                            />
                        </div>

                        {/* 9. Current Posting */}
                        <div className="space-y-1">
                            <Label htmlFor="currentPosting">
                                Current Posting / Affiliated Institution
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            <Input
                                id="currentPosting"
                                value={form.currentPosting}
                                onChange={(e) => set("currentPosting", e.target.value)}
                                placeholder="e.g. Dhaka Medical College Hospital"
                                disabled={isOther}
                                className={isOther ? "opacity-50" : ""}
                            />
                        </div>

                        {/* 10. Chamber Addresses */}
                        <div className="space-y-1">
                            <Label>
                                Chamber Address(es)
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            <div className="space-y-2">
                                {chamberAddresses.map((addr, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            value={addr}
                                            onChange={(e) => updateChamber(i, e.target.value)}
                                            placeholder={`Chamber address ${i + 1}`}
                                            disabled={isOther}
                                            className={isOther ? "opacity-50" : ""}
                                        />
                                        {chamberAddresses.length > 1 && !isOther && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeChamber(i)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {!isOther && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addChamber}
                                        className="mt-1"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Chamber
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* 11. Short Biography */}
                        <div className="space-y-1">
                            <Label htmlFor="shortBiography">
                                Short Biography
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            <Textarea
                                id="shortBiography"
                                value={form.shortBiography}
                                onChange={(e) => set("shortBiography", e.target.value)}
                                placeholder="Write about yourself..."
                                rows={3}
                                disabled={isOther}
                                className={isOther ? "opacity-50" : ""}
                            />
                        </div>

                        {/* 12. Journals */}
                        <div className="space-y-1">
                            <Label htmlFor="journals">
                                Journals
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            <Textarea
                                id="journals"
                                value={form.journals}
                                onChange={(e) => set("journals", e.target.value)}
                                placeholder="List your published journals..."
                                rows={2}
                                disabled={isOther}
                                className={isOther ? "opacity-50" : ""}
                            />
                        </div>

                        {/* 13. Profile Picture URL */}
                        <div className="space-y-1">
                            <Label htmlFor="profilePicture">Profile Picture URL</Label>
                            <Input
                                id="profilePicture"
                                value={form.profilePicture}
                                onChange={(e) => set("profilePicture", e.target.value)}
                                placeholder="https://... (link to your photo)"
                            />
                        </div>

                        {/* 14. Background Picture URL */}
                        <div className="space-y-1">
                            <Label htmlFor="backgroundPicture">
                                Background Picture URL
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            <Input
                                id="backgroundPicture"
                                value={form.backgroundPicture}
                                onChange={(e) => set("backgroundPicture", e.target.value)}
                                placeholder="https://... (link to background image)"
                                disabled={isOther}
                                className={isOther ? "opacity-50" : ""}
                            />
                        </div>

                        {/* 15. Interventions / Diseases */}
                        <div className="space-y-1">
                            <Label>
                                Interventions / Diseases
                                {isOther && (
                                    <span className="ml-2 text-xs text-slate-400">(N/A for Other specialty)</span>
                                )}
                            </Label>
                            {!isOther && (
                                <div className="flex gap-2">
                                    <Input
                                        value={interventionInput}
                                        onChange={(e) => setInterventionInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addIntervention();
                                            }
                                        }}
                                        placeholder="e.g. ERCP, Endoscopy (press Enter to add)"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addIntervention}
                                    >
                                        Add
                                    </Button>
                                </div>
                            )}
                            {interventions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {interventions.map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                            {!isOther && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIntervention(tag)}
                                                    className="hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 pt-2 pb-1">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting || !form.specialtySubject}>
                                {submitting ? "Submitting..." : "Submit Application"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
