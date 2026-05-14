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

const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url as string;
};

export default function MemberSignupModal({ open, onClose }: Props) {
    const [form, setForm] = useState({
        name: "",
        mobileNo: "",
        email: "",
        bmdcNo: "",
        designation: "",
        specialtySubject: "",
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

    const handleFile = async (key: string, file: File | null) => {
        if (!file) { set(key, ""); return; }
        const url = await uploadFile(file);
        set(key, url);
    };

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
            name: "", mobileNo: "", email: "", bmdcNo: "", designation: "",
            specialtySubject: "", academicQualifications: "", specializedTraining: "",
            currentPosting: "", shortBiography: "", journals: "",
            profilePicture: "", backgroundPicture: "",
        });
        setChamberAddresses([""]);
        setInterventions([]);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">
                        Member Sign Up
                    </DialogTitle>
                </DialogHeader>

                {submitted ? (
                    <div className="flex flex-col items-center gap-4 py-10 text-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h3 className="text-xl font-semibold text-slate-800">Application Submitted!</h3>
                        <p className="text-slate-600 max-w-sm">
                            Your application has been received and is pending admin review.
                        </p>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* 1. Name */}
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                required
                            />
                        </div>

                        {/* 2. Mobile No */}
                        <div className="space-y-1">
                            <Label htmlFor="mobileNo">Mobile No</Label>
                            <Input
                                id="mobileNo"
                                value={form.mobileNo}
                                onChange={(e) => set("mobileNo", e.target.value)}
                                placeholder="+8801XXXXXXXXX"
                                required
                            />
                        </div>

                        {/* 3. Email address */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                required
                            />
                        </div>

                        {/* 4. BMDC no */}
                        <div className="space-y-1">
                            <Label htmlFor="bmdcNo">BMDC no</Label>
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
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                value={form.designation}
                                onChange={(e) => set("designation", e.target.value)}
                                required
                            />
                        </div>

                        {/* 6. Specialty Subject */}
                        <div className="space-y-1">
                            <Label>Specialty Subject</Label>
                            <Select
                                value={form.specialtySubject}
                                onValueChange={(v) => set("specialtySubject", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hepatologist">Hepatologist</SelectItem>
                                    <SelectItem value="hepatobiliary_surgeon">Hepatobiliary Surgeon</SelectItem>
                                    <SelectItem value="intervention_hepatologist">Intervention Hepatologist</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 7. Academic Qualifications or professional degrees */}
                        <div className="space-y-1">
                            <Label htmlFor="academicQualifications">
                                Academic Qualifications or professional degrees
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
                            <Label htmlFor="specializedTraining">Specialized Training</Label>
                            <Input
                                id="specializedTraining"
                                value={form.specializedTraining}
                                onChange={(e) => set("specializedTraining", e.target.value)}
                            />
                        </div>

                        {/* 9. Current Posting or Affiliated Institution */}
                        <div className="space-y-1">
                            <Label htmlFor="currentPosting">
                                Current Posting or Affiliated Institution
                            </Label>
                            <Input
                                id="currentPosting"
                                value={form.currentPosting}
                                onChange={(e) => set("currentPosting", e.target.value)}
                                placeholder="e.g. Dhaka Medical College Hospital"
                                disabled={isOther}
                            />
                        </div>

                        {/* 10. Chamber address */}
                        <div className="space-y-1">
                            <Label>Chamber address</Label>
                            <div className="space-y-2">
                                {chamberAddresses.map((addr, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            value={addr}
                                            onChange={(e) => updateChamber(i, e.target.value)}
                                            disabled={isOther}
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
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* 11. Short Biography */}
                        <div className="space-y-1">
                            <Label htmlFor="shortBiography">Short Biography</Label>
                            <Textarea
                                id="shortBiography"
                                value={form.shortBiography}
                                onChange={(e) => set("shortBiography", e.target.value)}
                                placeholder="Write about yourself"
                                rows={3}
                                disabled={isOther}
                            />
                        </div>

                        {/* 12. Journals */}
                        <div className="space-y-1">
                            <Label htmlFor="journals">Journals</Label>
                            <Textarea
                                id="journals"
                                value={form.journals}
                                onChange={(e) => set("journals", e.target.value)}
                                rows={2}
                                disabled={isOther}
                            />
                        </div>

                        {/* 13. Profile picture */}
                        <div className="space-y-1">
                            <Label htmlFor="profilePicture">Profile picture</Label>
                            <input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFile("profilePicture", e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                        </div>

                        {/* 14. Background picture */}
                        <div className="space-y-1">
                            <Label htmlFor="backgroundPicture">Background picture</Label>
                            <input
                                id="backgroundPicture"
                                type="file"
                                accept="image/*"
                                disabled={isOther}
                                onChange={(e) => handleFile("backgroundPicture", e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* 15. Interventions you are doing or disease you are dealing */}
                        <div className="space-y-1">
                            <Label>Interventions you are doing or disease you are dealing</Label>
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
                                        placeholder="e.g. ERCP, Endoscopy"
                                    />
                                    <Button type="button" variant="outline" onClick={addIntervention}>
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
                                            <button
                                                type="button"
                                                onClick={() => removeIntervention(tag)}
                                                className="hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
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
                                {submitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
