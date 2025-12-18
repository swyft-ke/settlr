"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, MapPin, Home } from "lucide-react";

export default function ResultsPage() {
    const [matchCount, setMatchCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Simulate loading matches
        setTimeout(() => setMatchCount(14), 800);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-settlr-black text-white p-6 sticky top-0 z-10">
                <h1 className="text-xl font-bold">Settlr.</h1>
                <p className="text-settlr-green font-medium">{matchCount > 0 ? `${matchCount} Verified Matches Found` : "Searching..."}</p>
            </div>

            <div className="p-4 space-y-4">
                {/* Blurred Listing Items */}
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden relative">
                        <div className="h-48 bg-gray-200 relative">
                            {/* Simulated Blurred Image */}
                            <div className="absolute inset-0 bg-neutral-300 filter blur-xl opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="h-12 w-12 text-gray-500" />
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="h-6 w-2/3 bg-gray-200 rounded mb-2 animate-pulse filter blur-sm"></div>
                            <div className="h-4 w-1/3 bg-gray-200 rounded mb-4 animate-pulse filter blur-sm"></div>

                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span className="blur-sm select-none">Location Hidden</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                <Home className="h-4 w-4" />
                                <span>2 Bedroom, Modern Finishes</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t box-border">
                <div className="text-center mb-2">
                    <p className="text-sm text-gray-500">Unlock full details + Schedule Tours</p>
                    <p className="text-lg font-bold">KES 3,500</p>
                </div>
                <Link href="/payment" className="w-full block">
                    <Button className="w-full bg-settlr-green text-black hover:bg-settlr-green/90 h-12 text-lg font-bold">
                        Unlock Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}
