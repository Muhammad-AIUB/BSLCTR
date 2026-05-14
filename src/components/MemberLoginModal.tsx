"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (name: string) => void;
}

export default function MemberLoginModal({ open, onClose, onSuccess }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/member/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                handleClose();
                onSuccess(data.name);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Member Login</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="member-email">Email address</Label>
                        <Input
                            id="member-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="member-password">Password</Label>
                        <Input
                            id="member-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                            {error}
                        </p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
