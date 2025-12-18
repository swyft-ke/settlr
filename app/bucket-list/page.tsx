"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock property data
const PROPERTIES = [
    { id: 1, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400", name: "Westlands Heights" },
    { id: 2, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", name: "The Nova" },
    { id: 3, image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400", name: "Luxury Interior" },
    { id: 4, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", name: "Modern Complex" },
    { id: 5, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400", name: "Villa Estate" },
    { id: 6, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", name: "Contemporary Home" },
];

export default function BucketListPage() {
    const router = useRouter();
    const [selectedProperties, setSelectedProperties] = useState<number[]>([1, 2, 3, 4, 5]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const toggleProperty = (id: number) => {
        if (selectedProperties.includes(id)) {
            setSelectedProperties(selectedProperties.filter(p => p !== id));
        } else {
            setSelectedProperties([...selectedProperties, id]);
        }
    };

    const proceedToSchedule = () => {
        setShowConfirmModal(true);
    };

    const confirmAndContinue = () => {
        const selectedUnits = selectedProperties.length;
        const totalPrice = selectedUnits * 300;
        localStorage.setItem('settlr_selected_units', selectedUnits.toString());
        localStorage.setItem('settlr_total_price', totalPrice.toString());
        localStorage.setItem('settlr_bucket_list', JSON.stringify(selectedProperties));

        router.push('/dashboard/client');
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header */}
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Edit your Bucket list</h1>
            </div>

            {/* Property Grid */}
            <div className="px-6">
                <div className="grid grid-cols-2 gap-4">
                    {PROPERTIES.map((property) => {
                        const isSelected = selectedProperties.includes(property.id);

                        return (
                            <div
                                key={property.id}
                                className="relative rounded-2xl overflow-hidden aspect-square"
                            >
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Action Buttons */}
                                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                                    {isSelected && (
                                        <button
                                            onClick={() => toggleProperty(property.id)}
                                            className="bg-red-500 rounded-full p-3 shadow-lg"
                                        >
                                            <Trash2 className="h-5 w-5 text-white" />
                                        </button>
                                    )}
                                    {!isSelected && (
                                        <button
                                            onClick={() => toggleProperty(property.id)}
                                            className="bg-settlr-green rounded-full p-3 shadow-lg ml-auto"
                                        >
                                            <Plus className="h-5 w-5 text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Text */}
                <div className="mt-8 text-center">
                    <p className="text-gray-700 font-medium">
                        These are the Units You will view
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedProperties.length} {selectedProperties.length === 1 ? 'unit' : 'units'} selected
                    </p>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6">
                <Button
                    onClick={proceedToSchedule}
                    disabled={selectedProperties.length === 0}
                    className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full text-lg disabled:opacity-50"
                >
                    Choose a Date
                </Button>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-20 h-20 bg-settlr-green rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-settlr-green">Confirmed</h3>

                            <h2 className="text-2xl font-bold text-center">Happy Hunting !</h2>

                            <div className="text-6xl">🤗</div>
                        </div>

                        <Button
                            onClick={confirmAndContinue}
                            className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-12 font-bold rounded-full text-lg"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
