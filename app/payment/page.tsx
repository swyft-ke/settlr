"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'PHONE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('PHONE');
    const [phone, setPhone] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedUnits, setSelectedUnits] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Get pricing from localStorage
        const units = parseInt(localStorage.getItem('settlr_selected_units') || '5');
        const price = parseInt(localStorage.getItem('settlr_total_price') || '1500');
        setSelectedUnits(units);
        setTotalPrice(price);
    }, []);

    const handlePay = async () => {
        if (!phone || phone.length < 10) {
            setErrorMessage("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setStep('PROCESSING');
        setErrorMessage("");

        try {
            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`,
                    amount: totalPrice
                })
            });

            const data = await response.json();

            if (data.success) {
                // STK push sent successfully
                // In production, you'd poll or wait for webhook
                setTimeout(() => {
                    setLoading(false);
                    setStep('SUCCESS');

                    // Redirect to bucket list
                    setTimeout(() => {
                        router.push('/bucket-list');
                    }, 2000);
                }, 3000);
            } else {
                setLoading(false);
                setStep('ERROR');
                setErrorMessage(data.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            setStep('ERROR');
            setErrorMessage('An error occurred. Please try again.');
            console.error('Payment error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg space-y-6">

                {step === 'PHONE' && (
                    <>
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold">Complete Payment</h1>
                            <p className="text-gray-500">Secure payment via M-Pesa</p>
                        </div>

                        <div className="bg-settlr-yellow/20 p-4 rounded-2xl text-sm text-yellow-800 border border-settlr-yellow">
                            An M-Pesa prompt will be sent to your phone number.
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    placeholder="0712 345 678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-12 rounded-xl border-gray-300"
                                />
                                {errorMessage && (
                                    <p className="text-sm text-red-500">{errorMessage}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Units to unlock</span>
                                    <span className="font-bold">{selectedUnits}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-bold text-xl text-settlr-green">
                                        KES {totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full text-lg"
                                onClick={handlePay}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Pay Now'}
                            </Button>
                        </div>
                    </>
                )}

                {step === 'PROCESSING' && (
                    <div className="text-center py-8 space-y-4">
                        <Loader2 className="h-16 w-16 text-settlr-green animate-spin mx-auto" />
                        <h2 className="font-bold text-xl">Check your phone...</h2>
                        <p className="text-gray-500">Enter your M-Pesa PIN to complete the transaction.</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-20 h-20 bg-settlr-green rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="font-bold text-2xl">Payment Successful!</h2>
                        <p className="text-gray-500">Redirecting to select your tour units...</p>
                    </div>
                )}

                {step === 'ERROR' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-4xl">✕</span>
                        </div>
                        <h2 className="font-bold text-2xl">Payment Failed</h2>
                        <p className="text-gray-500">{errorMessage}</p>
                        <Button
                            className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-12 font-bold rounded-full"
                            onClick={() => setStep('PHONE')}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
