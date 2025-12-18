"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, Plus, QrCode } from "lucide-react";

export default function ScoutDashboard() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Scout Portal</h1>
                <div className="h-8 w-8 bg-settlr-green rounded-full flex items-center justify-center text-black font-bold">S</div>
            </div>

            <div className="space-y-6">
                {/* Action Bar */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/dashboard/scout/upload" className="w-full">
                        <Button className="w-full h-24 flex-col bg-settlr-green text-black hover:bg-settlr-green/90">
                            <Plus className="h-6 w-6 mb-2" />
                            Add Inventory
                        </Button>
                    </Link>
                    <Button className="w-full h-24 flex-col bg-gray-800 hover:bg-gray-700">
                        <QrCode className="h-6 w-6 mb-2" />
                        Verify Client
                    </Button>
                </div>

                {/* Current Job */}
                <div className="space-y-2">
                    <h2 className="text-gray-400 text-sm uppercase tracking-wider">Today's Job</h2>
                    <Card className="bg-gray-800 border-none text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex justify-between">
                                <span>David M.</span>
                                <span className="text-settlr-yellow text-sm font-normal">Starting in 45m</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 mt-1 h-4 w-4" />
                                <div>
                                    <p className="text-sm">Pickup: Sarit Centre</p>
                                    <p className="text-xs text-gray-400">Navigate there</p>
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-gray-700">
                                <div className="text-sm flex justify-between">
                                    <span>1. Westlands Heights</span>
                                    <span className="text-green-400">Confirmed</span>
                                </div>
                                <div className="text-sm flex justify-between">
                                    <span>2. The Nova</span>
                                    <span className="text-green-400">Confirmed</span>
                                </div>
                                <div className="text-sm flex justify-between">
                                    <span>3. 3408 Rose Ave</span>
                                    <span className="text-red-400">Call Caretaker</span>
                                </div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-gray-200">
                                Start Tour Mode
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
