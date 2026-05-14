"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AdminLoginModal() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const enteredEmail = email.trim();

        if (enteredEmail === "admin@bslctr.org" && password === "admin123") {
            localStorage.setItem(
                "adminAuth",
                JSON.stringify({ email: enteredEmail, loggedInAt: Date.now() })
            );
            setOpen(false);
            setEmail("");
            setPassword("");
            router.push("/dashboard");
            return;
        } else {
            setError("Invalid credentials. Use admin@bslctr.org / admin123");
            return;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-800 hover:bg-blue-900 rounded-full">
                    Admin Login
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Admin Login</DialogTitle>
                </DialogHeader>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error ? (
                        <div className="text-destructive text-sm" role="alert">
                            {error}
                        </div>
                    ) : null}

                    <Button type="submit" className="mt-2">
                        Log in
                    </Button>
                </form>

                <div className="text-xs text-muted-foreground mt-2">
                    Only authorized admins can log in.
                </div>
            </DialogContent>
        </Dialog>
    );
}
