"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ResultsPage() {
    const router = useRouter();
    const [matchCount] = useState(16);
    const [selectedUnits, setSelectedUnits] = useState(5);

    // Price calculation: 300 KES per unit
    const pricePerUnit = 300;
    const totalPrice = selectedUnits * pricePerUnit;

    const incrementUnits = () => {
        if (selectedUnits < matchCount) {
            setSelectedUnits(selectedUnits + 1);
        }
    };

    const decrementUnits = () => {
        if (selectedUnits > 1) {
            setSelectedUnits(selectedUnits - 1);
        }
    };

    const proceedToBucketList = () => {
        localStorage.setItem('settlr_selected_units', selectedUnits.toString());
        localStorage.setItem('settlr_total_price', totalPrice.toString());
        router.push('/payment');
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <div className="p-6 text-center space-y-2">
                <h1 className="text-3xl font-bold inline-flex items-center justify-center gap-2">
                    Yay! <span className="text-5xl">😁</span>
                </h1>
                <p className="text-gray-700 font-medium">
                    Settlr has <span className="font-bold">{matchCount} units</span> that fit your preference
                </p>
            </div>

            {/* Blurred Property Cards */}
            <div className="px-6 space-y-4 mb-8">
                {[1, 2].map((i) => (
                    <div key={i} className="relative h-64 rounded-2xl overflow-hidden">
                        <img
                            src={`https://images.unsplash.com/photo-${i === 1 ? '1545324418' : '1600596542'}-${i === 1 ? 'cc1a3fa10c00' : '815-ffad4c1539a9'}?w=600`}
                            alt="Property"
                            className="w-full h-full object-cover filter blur-md"
                        />
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                    </div>
                ))}
            </div>

            {/* Unit Counter */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <button
                    onClick={decrementUnits}
                    disabled={selectedUnits === 1}
                    className="bg-settlr-green rounded-full p-3 disabled:opacity-50"
                >
                    <ChevronLeft className="h-8 w-8 text-white font-bold" />
                </button>

                <div className="text-6xl font-bold w-24 text-center">
                    {selectedUnits}
                </div>

                <button
                    onClick={incrementUnits}
                    disabled={selectedUnits === matchCount}
                    className="bg-settlr-green rounded-full p-3 disabled:opacity-50"
                >
                    <ChevronRight className="h-8 w-8 text-white font-bold" />
                </button>
            </div>

            {/* Info Text */}
            <p className="text-center text-gray-600 px-6 mb-8">
                Unlock {selectedUnits} {selectedUnits === 1 ? 'unit' : 'units'} and get ready to move
            </p>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6">
                <Button
                    onClick={proceedToBucketList}
                    className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full text-lg"
                >
                    KES {totalPrice.toLocaleString()}
                </Button>
            </div>
        </div>
    );
}
