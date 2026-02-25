"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Assuming sonner is installed as seen in file list

import { login } from "@/utils/api/auth";
import { useAppContext } from "@/context/AppContext";

export default function LoginPage() {
    const { setDataLoaded } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setDataLoaded(true);
    }, [setDataLoaded]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            toast.success("Login successful");
            router.push("/admin");
        } catch (error) {
            console.error("An error occurred while logging: ", error);
            toast.error("An error occurred while logging, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your credentials to access the admin panel via /admin
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Input
                                type="email"
                                placeholder="Email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
