"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Wand2, Loader2, ArrowLeft } from "lucide-react";

export default function UploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [formData, setFormData] = useState({
        location: "",
        price: "",
        title: "",
        description: "",
        tags: ""
    });

    const handleGenerate = async () => {
        setLoading(true);
        // Simulate AI Generation delay
        setTimeout(() => {
            setLoading(false);
            setGenerated(true);
            setFormData(prev => ({
                ...prev,
                title: "Modern 2BR Apartment with Views",
                description: "Spacious 2-bedroom unit featuring open-plan living, wooden floors, and excellent natural light. Located in a secure compound with backup generator and high-speed lift.",
                tags: "Gym, DSQ, Borehole"
            }));
        }, 2500);
    };

    const handlePublish = async () => {
        // Logic to save to DB would go here
        router.push('/dashboard/scout');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-gray-800">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-bold">Add Inventory</h1>
            </div>

            <div className="space-y-6">
                {/* Photo Upload Mock */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        <Camera className="text-gray-500" />
                    </div>
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        <Camera className="text-gray-500" />
                    </div>
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        <Camera className="text-gray-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Location</label>
                        <Input
                            placeholder="e.g. Kileleshwa"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Price (KES)</label>
                        <Input
                            placeholder="e.g. 65,000"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                </div>

                {!generated ? (
                    <Button
                        className="w-full bg-settlr-green text-black hover:bg-settlr-green/90 h-12 text-lg font-bold"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Photos...</>
                        ) : (
                            <><Wand2 className="mr-2 h-5 w-5" /> Generate Details (AI)</>
                        )}
                    </Button>
                ) : (
                    <div className="space-y-4 border-t border-gray-700 pt-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <label className="text-sm text-settlr-yellow">AI Generated Title</label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-white"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-settlr-yellow">AI Description</label>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-settlr-yellow"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-settlr-yellow">Detected Amenities (Tags)</label>
                            <Input
                                className="bg-gray-800 border-gray-700 text-white"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <Button
                            className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg font-bold mt-4"
                            onClick={handlePublish}
                        >
                            Publish Listing
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
