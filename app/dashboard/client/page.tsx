"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";

export default function ClientDashboard() {
    const [scheduled, setScheduled] = useState(false);

    // Mock Scheduling
    const handleSchedule = () => {
        setScheduled(true);
    };

    if (scheduled) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <h1 className="text-2xl font-bold mb-6">My Tours</h1>
                <Card className="border-l-4 border-l-settlr-green">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Tour #1290 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmed</span>
                        </CardTitle>
                        <CardDescription>Scheduled for Tomorrow</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="text-gray-500" />
                            <div>
                                <p className="font-medium">10:00 AM - 12:00 PM</p>
                                <p className="text-xs text-gray-500">Driver arrives at 9:45 AM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-gray-500" />
                            <div>
                                <p className="font-medium">Pickup Location</p>
                                <p className="text-sm text-gray-500">Sarit Centre, Westlands</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <p className="font-medium mb-2">Itinerary (5 Units)</p>
                            <div className="space-y-2">
                                <div className="text-sm bg-gray-100 p-2 rounded">1. Westlands Heights (2BR)</div>
                                <div className="text-sm bg-gray-100 p-2 rounded">2. The Nova (2BR)</div>
                                <div className="text-sm bg-gray-100 p-2 rounded">3. 3 more hidden units...</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-500 mb-6">You've unlocked 14 verified matches. Schedule your tour now.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule Your Tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Date</label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="border-settlr-green bg-green-50">Tomorrow</Button>
                            <Button variant="outline">Sat, 21st</Button>
                            <Button variant="outline">Sun, 22nd</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Time</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline">Morning (9AM - 1PM)</Button>
                            <Button variant="outline">Afternoon (2PM - 6PM)</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup Location</label>
                        <Button variant="outline" className="w-full justify-start text-gray-500">
                            <MapPin className="mr-2 h-4 w-4" /> Set on Map
                        </Button>
                    </div>

                    <Button className="w-full bg-settlr-green text-black hover:bg-settlr-green/90 h-12" onClick={handleSchedule}>
                        Confirm Tour
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
