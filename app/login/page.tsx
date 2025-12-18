import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Partner Login</h1>
                    <p className="text-gray-500">Enter your credentials to access the Scout Portal.</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">E-mail / Phone</label>
                        <Input placeholder="scout@settlr.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <Link href="/dashboard/scout">
                        <Button className="w-full bg-settlr-black text-white hover:bg-gray-800">
                            Login
                        </Button>
                    </Link>
                </div>
                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
