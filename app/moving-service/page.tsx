"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, Calendar } from "lucide-react";
import {
    calculateTransportCost,
    calculateFullMovingCost,
    getAvailableVehicles,
    getAvailableHouseTypes,
} from "@/lib/moving-calculator";

type ServiceType = 'TRANSPORT' | 'FULL_SERVICE';

export default function MovingServicePage() {
    const router = useRouter();

    // Service selection
    const [serviceType, setServiceType] = useState<ServiceType | null>(null);

    // Location states
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [fromAutocomplete, setFromAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [toAutocomplete, setToAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const fromInputRef = useRef<HTMLInputElement>(null);
    const toInputRef = useRef<HTMLInputElement>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);

    // Transport only selection
    const [selectedVehicle, setSelectedVehicle] = useState("");

    // Full service selection
    const [selectedHouseType, setSelectedHouseType] = useState("");

    // Calculation states
    const [calculating, setCalculating] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [quote, setQuote] = useState<any>(null);

    // Date picker modal
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Load Google Maps script
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || (window as any).google?.maps) {
            setMapsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapsLoaded(true);
        document.head.appendChild(script);
    }, []);

    // Initialize autocomplete when maps is loaded AND service type is selected
    useEffect(() => {
        if (!mapsLoaded || !serviceType || !fromInputRef.current || !toInputRef.current) return;

        try {
            // From location autocomplete
            const fromAuto = new google.maps.places.Autocomplete(fromInputRef.current, {
                componentRestrictions: { country: 'ke' },
                fields: ['formatted_address', 'geometry', 'name', 'place_id']
            });

            fromAuto.addListener('place_changed', () => {
                const place = fromAuto.getPlace();
                if (place.formatted_address) {
                    setFromLocation(place.formatted_address);
                }
            });

            setFromAutocomplete(fromAuto);

            // To location autocomplete
            const toAuto = new google.maps.places.Autocomplete(toInputRef.current, {
                componentRestrictions: { country: 'ke' },
                fields: ['formatted_address', 'geometry', 'name', 'place_id']
            });

            toAuto.addListener('place_changed', () => {
                const place = toAuto.getPlace();
                if (place.formatted_address) {
                    setToLocation(place.formatted_address);
                }
            });

            setToAutocomplete(toAuto);
        } catch (error) {
            console.error('Error initializing autocomplete:', error);
        }
    }, [mapsLoaded, serviceType]);

    const handleCalculate = async () => {
        if (!fromLocation || !toLocation) {
            alert("Please enter both locations");
            return;
        }

        if (serviceType === 'TRANSPORT' && !selectedVehicle) {
            alert("Please select a vehicle");
            return;
        }

        if (serviceType === 'FULL_SERVICE' && !selectedHouseType) {
            alert("Please select your house type");
            return;
        }

        setCalculating(true);
        setQuote(null);

        try {
            // Call API to calculate distance using Google Places API
            const response = await fetch('/api/moving/calculate-distance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin: fromLocation, destination: toLocation }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to calculate distance');
            }

            const distanceKm = data.distanceKm;
            setDistance(distanceKm);

            // Calculate pricing based on service type
            let quoteData;
            if (serviceType === 'TRANSPORT') {
                const cost = calculateTransportCost(selectedVehicle, distanceKm);
                quoteData = {
                    type: 'transport',
                    vehicle: selectedVehicle,
                    distance: distanceKm,
                    duration: data.durationMinutes,
                    total: cost,
                };
            } else {
                const fullCost = calculateFullMovingCost(selectedHouseType, distanceKm);
                quoteData = {
                    type: 'full_service',
                    houseType: selectedHouseType,
                    distance: distanceKm,
                    duration: data.durationMinutes,
                    ...fullCost,
                };
            }

            setQuote(quoteData);
        } catch (error: any) {
            console.error('Error calculating quote:', error);
            alert(error.message || 'Failed to calculate quote. Please try again.');
        } finally {
            setCalculating(false);
        }
    };

    const handleBookMoving = () => {
        setShowDatePicker(true);
    };

    const confirmBooking = () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select both date and time");
            return;
        }

        // Save booking details
        const bookingDetails = {
            serviceType,
            fromLocation,
            toLocation,
            distance,
            quote,
            scheduledDate: selectedDate,
            scheduledTime: selectedTime,
        };

        localStorage.setItem('settlr_moving_booking', JSON.stringify(bookingDetails));

        // Show success and redirect
        alert("Moving service booked successfully! We'll contact you shortly.");
        router.push('/dashboard/client');
    };

    return (
        <div className="min-h-screen bg-white p-6 pb-32">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => router.back()} className="mb-4">
                    ← Back
                </button>
                <h1 className="text-3xl font-bold">Plan Your Move 📦</h1>
                <p className="text-gray-600 mt-2">Get an instant quote for your moving needs</p>
            </div>

            {/* Service Type Selection */}
            {!serviceType && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Choose Service Type</h2>
                    <button
                        onClick={() => setServiceType('TRANSPORT')}
                        className="w-full p-6 border-2 border-settlr-green rounded-2xl hover:bg-settlr-green/5 transition-colors text-left"
                    >
                        <h3 className="font-bold text-lg">🚚 Transport Only</h3>
                        <p className="text-gray-600 text-sm mt-1">Just need a vehicle? Choose your ride</p>
                    </button>
                    <button
                        onClick={() => setServiceType('FULL_SERVICE')}
                        className="w-full p-6 border-2 border-settlr-green rounded-2xl hover:bg-settlr-green/5 transition-colors text-left"
                    >
                        <h3 className="font-bold text-lg">📦 Full Moving Service</h3>
                        <p className="text-gray-600 text-sm mt-1">Complete package: Transport + Loaders + Packing Materials</p>
                    </button>
                </div>
            )}

            {/* Main Form */}
            {serviceType && !quote && (
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setServiceType(null);
                            setQuote(null);
                            setDistance(null);
                        }}
                        className="mb-4"
                    >
                        ← Change Service Type
                    </Button>

                    {/* Location Inputs with Google Places Autocomplete */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">From (Current Location)</label>
                            <input
                                ref={fromInputRef}
                                type="text"
                                placeholder="e.g., Westlands, Nairobi"
                                value={fromLocation}
                                onChange={(e) => setFromLocation(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-settlr-green"
                            />
                            {!mapsLoaded && <p className="text-xs text-gray-500 mt-1">Loading autocomplete...</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">To (New Location)</label>
                            <input
                                ref={toInputRef}
                                type="text"
                                placeholder="e.g., Karen, Nairobi"
                                value={toLocation}
                                onChange={(e) => setToLocation(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-settlr-green"
                            />
                        </div>
                    </div>

                    {/* Vehicle Selection (Transport Only) */}
                    {serviceType === 'TRANSPORT' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Vehicle</label>
                            <div className="grid grid-cols-2 gap-3">
                                {getAvailableVehicles().map((vehicle) => (
                                    <button
                                        key={vehicle}
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        className={`p-4 rounded-xl border-2 font-medium transition-colors ${selectedVehicle === vehicle
                                            ? 'border-settlr-green bg-settlr-green text-white'
                                            : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        {vehicle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* House Type Selection (Full Service) */}
                    {serviceType === 'FULL_SERVICE' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">House Size</label>
                            <div className="grid grid-cols-2 gap-3">
                                {getAvailableHouseTypes().map((houseType) => (
                                    <button
                                        key={houseType}
                                        onClick={() => setSelectedHouseType(houseType)}
                                        className={`p-4 rounded-xl border-2 font-medium transition-colors ${selectedHouseType === houseType
                                            ? 'border-settlr-green bg-settlr-green text-white'
                                            : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        {houseType}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handleCalculate}
                        disabled={calculating}
                        className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full"
                    >
                        {calculating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Calculating...
                            </>
                        ) : (
                            'Get Quote'
                        )}
                    </Button>
                </div>
            )}

            {/* Quote Display */}
            {quote && (
                <div className="space-y-6">
                    <div className="bg-settlr-green/10 border-2 border-settlr-green rounded-2xl p-6 space-y-4">
                        <h2 className="text-2xl font-bold">Your Quote</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">From</span>
                                <span className="font-medium text-right flex-1 ml-4">{fromLocation}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">To</span>
                                <span className="font-medium text-right flex-1 ml-4">{toLocation}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Distance</span>
                                <span className="font-medium">{quote.distance.toFixed(1)} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Est. Duration</span>
                                <span className="font-medium">{quote.duration} mins</span>
                            </div>
                        </div>

                        {quote.type === 'transport' && (
                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{quote.vehicle}</span>
                                    <span className="text-2xl font-bold text-settlr-green">
                                        KES {quote.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {quote.type === 'full_service' && (
                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Transport ({quote.breakdown.vehicle})</span>
                                    <span>KES {quote.transportCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Labor ({quote.breakdown.loaders} loaders)</span>
                                    <span>KES {quote.laborCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Packing Materials</span>
                                    <span>KES {quote.materialsCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Service Fee (10%)</span>
                                    <span>KES {quote.serviceFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Service Markup</span>
                                    <span>KES {quote.markup.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t-2">
                                    <span className="font-bold">Total</span>
                                    <span className="text-2xl font-bold text-settlr-green">
                                        KES {quote.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleBookMoving}
                            className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full"
                        >
                            Book Moving Service
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setQuote(null);
                                setDistance(null);
                            }}
                            className="w-full h-12 rounded-full border-2"
                        >
                            Recalculate
                        </Button>
                    </div>
                </div>
            )}

            {/* Date Picker Modal */}
            {showDatePicker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Choose Date & Time</h3>
                            <button onClick={() => setShowDatePicker(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1" />
                                    Moving Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-settlr-green"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-settlr-green"
                                >
                                    <option value="">Select time</option>
                                    <option value="08:00 AM">08:00 AM</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={confirmBooking}
                            className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-12 font-bold rounded-full"
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
