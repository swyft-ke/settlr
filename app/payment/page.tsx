"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'PHONE' | 'PROCESSING' | 'SUCCESS'>('PHONE');

    const handlePay = () => {
        setLoading(true);
        setStep('PROCESSING');

        // Simulate STK Push delay
        setTimeout(() => {
            setLoading(false);
            setStep('SUCCESS');

            // Redirect to Dashboard after success
            setTimeout(() => {
                router.push('/dashboard/client');
            }, 2000);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete Payment</CardTitle>
                    <CardDescription>Secure payment via M-Pesa (Lipana)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 'PHONE' && (
                        <>
                            <div className="bg-settlr-yellow/20 p-4 rounded-lg text-sm text-yellow-800 border border-settlr-yellow">
                                An M-Pesa prompt will be sent to your phone number.
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input placeholder="07XX XXX XXX" defaultValue="07" />
                            </div>
                            <div className="flex justify-between items-center py-4 text-sm">
                                <span>Unlock Fee</span>
                                <span className="font-bold">KES 3,500</span>
                            </div>
                            <Button
                                className="w-full bg-settlr-green text-black hover:bg-settlr-green/90"
                                onClick={handlePay}
                            >
                                Pay Now
                            </Button>
                        </>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="text-center py-8 space-y-4">
                            <Loader2 className="h-12 w-12 text-settlr-green animate-spin mx-auto" />
                            <p className="font-medium">Check your phone...</p>
                            <p className="text-sm text-gray-500">Enter your M-Pesa PIN to complete the transaction.</p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-8 space-y-4">
                            <div className="h-16 w-16 bg-settlr-green rounded-full flex items-center justify-center mx-auto">
                                <span className="text-white text-3xl">✓</span>
                            </div>
                            <p className="font-bold text-xl">Payment Successful!</p>
                            <p className="text-sm text-gray-500">Redirecting to schedule your tour...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
