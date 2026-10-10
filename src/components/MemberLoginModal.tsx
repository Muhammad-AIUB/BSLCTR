"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MemberSignupForm } from "./forms/MemberSignupForm";

type AuthMode = "login" | "signup";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (name: string) => void;
}

export default function MemberLoginModal({ open, onClose, onSuccess }: Props) {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            // The login route went with the member dashboard and is not rebuilt yet.
            if (res.status === 404) {
                setError("Member login is not available yet.");
                return;
            }
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                handleClose();
                onSuccess(data.name);
                router.push("/member-dashboard");
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
        setAuthMode("login");
        onClose();
    };

    const handleSignupSuccess = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[85dvh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {authMode === "login" ? "Member Login" : "Member Sign Up"}
                    </DialogTitle>
                </DialogHeader>

                {authMode === "login" ? (
                    <>
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
                                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                                    {error}
                                </p>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </Button>
                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setAuthMode("signup")}
                        >
                            Create New Account
                        </Button>
                    </>
                ) : (
                    <MemberSignupForm
                        onBack={() => setAuthMode("login")}
                        onSuccess={handleSignupSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
