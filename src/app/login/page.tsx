"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/utils/api/auth";
import { useAppContext } from "@/context/AppContext";

export default function LoginPage() {
    const { setDataLoaded } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
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
            toast.error("Invalid credentials or server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#030303] text-[#e5e1e4] font-sans antialiased">
            {/* Left Side: Visual Experience */}
            <aside className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-[#424754] bg-[radial-gradient(circle_at_top_left,#1a1a1e_0%,#030303_100%)]">
                <div className="relative z-10 flex flex-col justify-between w-full p-16">
                    {/* Logo Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#adc6ff] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#002e6a]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.85L19.15 12H17v6h-2v-6H9v6H7v-6H4.85L12 5.85z"/>
                            </svg>
                        </div>
                        <span className="text-[20px] font-bold tracking-tight text-[#e5e1e4]">DevArchitect</span>
                    </div>

                    {/* Content Area */}
                    <div className="max-w-md">
                        <h1 className="text-[48px] font-semibold mb-6 leading-tight tracking-tight">
                            Master the <span className="text-[#adc6ff]">System</span> Architecture.
                        </h1>
                        <p className="text-[16px] leading-relaxed text-[#c2c6d6] mb-12">
                            Access the integrated development environment designed for elite system administrators and software architects.
                        </p>

                        {/* Illustration/Graphic Placeholder */}
                        <div className="relative rounded-xl overflow-hidden border border-[#424754] bg-[#0e0e10] aspect-video flex items-center justify-center group">
                            <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <img 
                                className="object-cover w-full h-full opacity-60" 
                                alt="A sophisticated dark-themed developer workstation visualization." 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUqWhpN-fetUn6ZP5ohivj7i8SD0Gw_aEt2TZJdocGy5ujwpwVxgj1CGVjFXcWqhkYPYbNPTQvrXgp_iYD1mVswWZ-y2wiKVyqc4enZTwCNBT-FLWAdkwbaT3kGZ9eu2gp-sZZ44Cr0dz8vF_nNP2VmDyD5tGjjbmPfVnrnGT0pGRyOInNksQIJx_MyLuznQrVMyX28_8PPCvhNiyR8bfsx_-Cbjlj6EpwWPJR1cylv5RQ_nVP3S6m6G5yW4xf4_4q3gXsOKFlS-A"
                            />
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="flex items-center gap-6 text-[#c2c6d6]/60 text-[12px] font-medium tracking-wider">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span>SYSTEMS NOMINAL</span>
                        </div>
                        <span>v4.2.0-STABLE</span>
                    </div>
                </div>
            </aside>

            {/* Right Side: Interaction */}
            <main className="w-full lg:w-1/2 flex items-center justify-center bg-[#131315] px-6 lg:px-0 relative">
                <div className="w-full max-w-sm flex flex-col">
                    {/* Form Header */}
                    <div className="text-center mb-10">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="w-8 h-8 bg-[#adc6ff] rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#002e6a]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.85L19.15 12H17v6h-2v-6H9v6H7v-6H4.85L12 5.85z"/>
                                </svg>
                            </div>
                            <span className="text-[20px] font-bold">DevArchitect</span>
                        </div>
                        <h2 className="text-[32px] font-semibold mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-[#c2c6d6]">Enter your credentials to manage your projects.</p>
                    </div>

                    {/* Login Card */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] transition-colors">@</span>
                                <input 
                                    className="w-full bg-[#0e0e10] border border-[#424754] rounded-lg pl-10 pr-4 py-3 text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    id="email" 
                                    placeholder="admin@devarchitect.io" 
                                    required 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block" htmlFor="password">Password</label>
                                <a className="text-[#adc6ff] hover:text-[#adc6ff]/80 text-[12px] font-medium transition-colors" href="#">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] transition-colors">🔒</span>
                                <input 
                                    className="w-full bg-[#0e0e10] border border-[#424754] rounded-lg pl-10 pr-4 py-3 text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    id="password" 
                                    placeholder="••••••••••••" 
                                    required 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input 
                                className="w-4 h-4 rounded border-[#424754] bg-[#0e0e10] text-[#adc6ff] focus:ring-offset-[#131315] focus:ring-[#adc6ff] transition-all" 
                                id="remember" 
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label className="text-[#c2c6d6] cursor-pointer select-none text-sm" htmlFor="remember">Remember this device for 30 days</label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            className="w-full bg-[#adc6ff] text-[#002e6a] font-medium py-4 rounded-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#adc6ff]/20 disabled:opacity-55" 
                            disabled={loading}
                            type="submit"
                        >
                            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
                        </button>
                    </form>

                    {/* Footer Navigation */}
                    <div className="mt-12 pt-8 border-t border-[#424754]/30 flex flex-col items-center gap-4">
                        <p className="text-[#c2c6d6] text-[12px] font-medium flex items-center gap-2">
                            <span>🛡️</span>
                            Protected Admin Access
                        </p>
                        <div className="flex gap-4">
                            <a className="text-[#8c909f] hover:text-[#e5e1e4] transition-colors text-[12px]" href="#">Privacy Policy</a>
                            <span className="text-[#424754]">•</span>
                            <a className="text-[#8c909f] hover:text-[#e5e1e4] transition-colors text-[12px]" href="#">Security Audit</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

