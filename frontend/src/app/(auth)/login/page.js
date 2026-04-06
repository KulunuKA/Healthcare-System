"use client";

import SidePanel from "@/components/Sidepanel";
import { GoogleIcon } from "@/components/svgIcons";
import { Button, Input } from "@/components/ui";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = () => {
        console.log(email, password);
    };
    return (
        <div className="w-full h-screen flex">
            <SidePanel />
            <div className="w-full h-full flex flex-col items-start gap-10 px-10 py-15 ">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Sign in to access your health dashboard</p>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <Input type="email" placeholder="Email" value={email} onChange={setEmail} icon={Mail} label="Email" />
                    <Input type="password" placeholder="Password" value={password} onChange={setPassword} icon={Lock} label="Password" />

                    <div className="flex flex-col gap-2 mb-4">
                        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">Forgot Password?</Link>
                    </div>
                    <Button onClick={handleLogin}>Login</Button>
                </div>

                <div className="divider">or continue with</div>


                <button className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 flex items-center justify-center gap-2 transition-colors duration-200 hover:border-gray-400">
                    <GoogleIcon />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}