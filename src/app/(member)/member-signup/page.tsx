"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Plus, CheckCircle, ArrowLeft } from "lucide-react";

const DISTRICTS = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
    "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga",
    "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni",
    "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
    "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna",
    "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat",
    "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
    "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali",
    "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira",
    "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail",
    "Thakurgaon",
];

const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url as string;
};

interface Chamber {
    district: string;
    address: string;
}

// Reusable multi-input list field (Designation, Academic, Training, Past Posting).
// Defined at module scope so its identity is stable across renders (keeps input focus).
function MultiList({
    label,
    values,
    setter,
    placeholder,
    disabled,
}: {
    label: string;
    values: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder?: string;
    disabled?: boolean;
}) {
    const add = () => setter((prev) => [...prev, ""]);
    const update = (i: number, val: string) =>
        setter((prev) => prev.map((x, idx) => (idx === i ? val : x)));
    const remove = (i: number) =>
        setter((prev) => prev.filter((_, idx) => idx !== i));

    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <div className="space-y-2">
                {values.map((v, i) => (
                    <div key={i} className="flex gap-2">
                        <Input
                            value={v}
                            onChange={(e) => update(i, e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                        {values.length > 1 && !disabled && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(i)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                {!disabled && (
                    <Button type="button" variant="outline" size="sm" onClick={add}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function MemberSignupPage() {
    const [form, setForm] = useState({
        name: "",
        mobileNo: "",
        email: "",
        password: "",
        bmdcNo: "",
        specialtySubject: "",
        currentPosting: "",
        shortIntroduction: "",
        shortBiography: "",
        journals: "",
        profilePicture: "",
        backgroundPicture: "",
    });

    const [designations, setDesignations] = useState<string[]>([""]);
    const [academics, setAcademics] = useState<string[]>([""]);
    const [trainings, setTrainings] = useState<string[]>([""]);
    const [pastPostings, setPastPostings] = useState<string[]>([""]);
    const [chambers, setChambers] = useState<Chamber[]>([{ district: "", address: "" }]);
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

    // Chamber helpers
    const addChamber = () => setChambers((prev) => [...prev, { district: "", address: "" }]);
    const updateChamber = (i: number, key: keyof Chamber, val: string) =>
        setChambers((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
    const removeChamber = (i: number) =>
        setChambers((prev) => prev.filter((_, idx) => idx !== i));

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
                    designation: designations.map((d) => d.trim()).filter(Boolean).join(", "),
                    academicQualifications: academics.map((a) => a.trim()).filter(Boolean).join(", "),
                    specializedTraining: trainings.map((t) => t.trim()).filter(Boolean).join(", "),
                    pastPostings: pastPostings.map((p) => p.trim()).filter(Boolean),
                    chamberAddresses: chambers
                        .map((c) => [c.district, c.address.trim()].filter(Boolean).join(" — "))
                        .filter(Boolean),
                    interventions,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/Logo1.png" alt="BSLCTR Logo" className="h-10" />
                        <span className="text-lg font-bold text-primary">BSLCTR</span>
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to site
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
                {submitted ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                            <h1 className="text-2xl font-bold text-slate-800">
                                Application Submitted!
                            </h1>
                            <p className="max-w-sm text-slate-600">
                                Your application has been received and is pending admin
                                review. You&apos;ll be able to log in once it is approved.
                            </p>
                            <Button asChild className="mt-2">
                                <Link href="/">Back to Home</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                Member Sign Up
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Register to join BSLCTR. Your application will be reviewed
                                by an admin before activation.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
                        >
                            {/* 1. Name — letters and "." only */}
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) => set("name", e.target.value.replace(/[^A-Za-z .]/g, ""))}
                                    placeholder="e.g. Md. John Doe"
                                    required
                                />
                            </div>

                            {/* 2. Mobile No — exactly 11 digits */}
                            <div className="space-y-1">
                                <Label htmlFor="mobileNo">Mobile No</Label>
                                <Input
                                    id="mobileNo"
                                    inputMode="numeric"
                                    value={form.mobileNo}
                                    onChange={(e) => set("mobileNo", e.target.value.replace(/\D/g, "").slice(0, 11))}
                                    placeholder="01XXXXXXXXX"
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

                            {/* Password (required to log in) */}
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => set("password", e.target.value)}
                                    required
                                />
                            </div>

                            {/* 4. BMDC no — letters and numbers */}
                            <div className="space-y-1">
                                <Label htmlFor="bmdcNo">BMDC no</Label>
                                <Input
                                    id="bmdcNo"
                                    value={form.bmdcNo}
                                    onChange={(e) => set("bmdcNo", e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                                    placeholder="e.g. A90809"
                                    required
                                />
                            </div>

                            {/* 5. Designation (multiple) */}
                            <MultiList
                                label="Designation"
                                values={designations}
                                setter={setDesignations}
                                placeholder="e.g. Prof."
                            />

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

                            {/* 7. Academic Qualifications (multiple) */}
                            <MultiList
                                label="Academic Qualifications or professional degrees"
                                values={academics}
                                setter={setAcademics}
                                placeholder="e.g. MD (Hepatology)"
                            />

                            {/* 8. Specialized Training (multiple) */}
                            <MultiList
                                label="Specialized Training"
                                values={trainings}
                                setter={setTrainings}
                                placeholder="e.g. Fellowship in Hepatology"
                            />

                            {/* 9. Current Posting */}
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

                            {/* 10. Past Posting (multiple) */}
                            <MultiList
                                label="Add Past Posting or Affiliated Institution"
                                values={pastPostings}
                                setter={setPastPostings}
                                placeholder="e.g. Labaid Specialized Hospital, Dhanmondi, Dhaka"
                                disabled={isOther}
                            />

                            {/* 11. Chamber address — district + address (multiple) */}
                            <div className="space-y-1">
                                <Label>Chamber address</Label>
                                <div className="space-y-2">
                                    {chambers.map((c, i) => (
                                        <div key={i} className="space-y-2 rounded-md border border-slate-200 bg-muted p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Chamber {i + 1}
                                                </span>
                                                {chambers.length > 1 && !isOther && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeChamber(i)}
                                                        className="rounded text-destructive/70 outline-none transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/40"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <Select
                                                value={c.district}
                                                onValueChange={(v) => updateChamber(i, "district", v)}
                                                disabled={isOther}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select district..." />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {DISTRICTS.map((d) => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                value={c.address}
                                                onChange={(e) => updateChamber(i, "address", e.target.value)}
                                                placeholder="Chamber address"
                                                disabled={isOther}
                                            />
                                        </div>
                                    ))}
                                    {!isOther && (
                                        <Button type="button" variant="outline" size="sm" onClick={addChamber}>
                                            <Plus className="mr-1 h-4 w-4" />
                                            Add chamber
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Short Introduction (prescription) */}
                            <div className="space-y-1">
                                <Label htmlFor="shortIntroduction">
                                    Short Introduction{" "}
                                    <span className="text-xs text-slate-500">
                                        (as written on your prescription)
                                    </span>
                                </Label>
                                <Textarea
                                    id="shortIntroduction"
                                    value={form.shortIntroduction}
                                    onChange={(e) => set("shortIntroduction", e.target.value)}
                                    placeholder={"e.g. Prof. John\nMBBS(DMC), FCPS(Hepatology), FRCP(London)\nFormer Professor and Head, Department of Hepatology,\nDhaka Medical College Hospital, Dhaka"}
                                    rows={4}
                                />
                            </div>

                            {/* Short Biography */}
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

                            {/* Journals */}
                            <div className="space-y-1">
                                <Label htmlFor="journals">Journals</Label>
                                <Textarea
                                    id="journals"
                                    value={form.journals}
                                    onChange={(e) => set("journals", e.target.value)}
                                    rows={2}
                                />
                            </div>

                            {/* Profile picture */}
                            <div className="space-y-1">
                                <Label htmlFor="profilePicture">Profile picture</Label>
                                <input
                                    id="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    disabled={isOther}
                                    onChange={(e) => handleFile("profilePicture", e.target.files?.[0] ?? null)}
                                    className="block w-full cursor-pointer text-sm text-slate-500 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {/* Background picture */}
                            <div className="space-y-1">
                                <Label htmlFor="backgroundPicture">Background picture</Label>
                                <input
                                    id="backgroundPicture"
                                    type="file"
                                    accept="image/*"
                                    disabled={isOther}
                                    onChange={(e) => handleFile("backgroundPicture", e.target.files?.[0] ?? null)}
                                    className="block w-full cursor-pointer text-sm text-slate-500 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {/* Interventions (tags) */}
                            <div className="space-y-1">
                                <Label>Interventions you are doing or diseases you are dealing</Label>
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
                                {interventions.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {interventions.map((tag) => (
                                            <span
                                                key={tag}
                                                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeIntervention(tag)}
                                                    className="-m-1.5 p-1.5 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {error && (
                                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    submitting ||
                                    !form.specialtySubject ||
                                    form.mobileNo.length !== 11 ||
                                    !designations.some((d) => d.trim()) ||
                                    !academics.some((a) => a.trim())
                                }
                            >
                                {submitting ? "Submitting..." : "Submit Application"}
                            </Button>

                            <p className="text-center text-sm text-slate-500">
                                Already a member?{" "}
                                <Link href="/" className="font-medium text-primary hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
