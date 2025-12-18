"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 'SIZE' | 'VIBE' | 'BUDGET' | 'DATE' | 'TAGS' | 'LOCATION';

const HOUSE_SIZES = ["Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom", "4 Bedroom", "Other ..."];

const VIBES = [
    { label: "Apartments", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" },
    { label: "Stand Alones", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400" },
    { label: "Villas", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400" },
    { label: "Mansions", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400" }
];

const MOVE_DATES = ["Immediately", "This Month", "Next Month", "Just Looking"];
const TAGS = ["Pet Friendly", "Borehole", "Gym", "Pool", "DSQ", "Security", "Balcony", "Parking"];

export default function QuizPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('SIZE');
    const [vibeIndex, setVibeIndex] = useState(0);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);

    const [selections, setSelections] = useState({
        size: "",
        vibe: "",
        minBudget: 10000,
        maxBudget: 20000,
        date: "",
        tags: [] as string[],
        location: "",
        coordinates: { lat: -1.2921, lng: 36.8219 } // Default: Nairobi
    });

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

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Initialize Google Maps when location step is active and Maps is loaded
    useEffect(() => {
        if (step === 'LOCATION' && mapsLoaded && mapRef.current && !mapInstanceRef.current) {
            initializeMap();
        }
    }, [step, mapsLoaded]);

    const initializeMap = () => {
        if (!mapRef.current || !mapsLoaded) return;

        try {
            // Initialize map
            const map = new google.maps.Map(mapRef.current, {
                center: selections.coordinates,
                zoom: 13,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
            });

            mapInstanceRef.current = map;

            // Add marker
            const marker = new google.maps.Marker({
                position: selections.coordinates,
                map: map,
                draggable: true,
            });

            markerRef.current = marker;

            // Update location when marker is dragged
            marker.addListener('dragend', () => {
                const position = marker.getPosition();
                if (position) {
                    setSelections(prev => ({
                        ...prev,
                        coordinates: { lat: position.lat(), lng: position.lng() }
                    }));
                }
            });

            // Initialize autocomplete
            const input = document.getElementById('location-input') as HTMLInputElement;
            if (input) {
                const autocomplete = new google.maps.places.Autocomplete(input, {
                    bounds: new google.maps.LatLngBounds(
                        new google.maps.LatLng(-1.4, 36.6),
                        new google.maps.LatLng(-1.1, 37.0)
                    ),
                    componentRestrictions: { country: 'ke' },
                    fields: ['geometry', 'name', 'formatted_address']
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry && place.geometry.location) {
                        const location = place.geometry.location;
                        const newCoords = { lat: location.lat(), lng: location.lng() };

                        setSelections(prev => ({
                            ...prev,
                            location: place.formatted_address || place.name || '',
                            coordinates: newCoords
                        }));

                        map.setCenter(newCoords);
                        marker.setPosition(newCoords);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading Google Maps:', error);
        }
    };

    const handleSelect = (key: keyof typeof selections, value: any) => {
        if (key === 'tags') {
            const current = selections.tags;
            const updated = current.includes(value)
                ? current.filter(t => t !== value)
                : [...current, value];
            setSelections({ ...selections, tags: updated });
        } else {
            setSelections({ ...selections, [key]: value });

            // Auto-advance for single-select steps
            setTimeout(() => {
                if (step === 'SIZE') setStep('VIBE');
                if (step === 'VIBE') setStep('BUDGET');
                if (step === 'DATE') setStep('TAGS');
            }, 300);
        }
    };

    const nextVibeSlide = () => {
        if (vibeIndex < VIBES.length - 1) {
            setVibeIndex(vibeIndex + 1);
        }
    };

    const prevVibeSlide = () => {
        if (vibeIndex > 0) {
            setVibeIndex(vibeIndex - 1);
        }
    };

    const selectVibe = () => {
        setSelections({ ...selections, vibe: VIBES[vibeIndex].label });
        setTimeout(() => setStep('BUDGET'), 300);
    };

    const finishQuiz = () => {
        localStorage.setItem('settlr_preferences', JSON.stringify(selections));
        router.push('/results');
    };

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col">

            {/* House Size */}
            {step === 'SIZE' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-medium">Which house size do you want?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {HOUSE_SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSelect('size', size)}
                                className={cn(
                                    "py-4 px-6 rounded-full border-2 border-settlr-green font-medium transition-colors",
                                    selections.size === size ? "bg-settlr-green text-white" : "bg-white text-black"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Vibe Type */}
            {step === 'VIBE' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-medium">What's Your Vibe?</h2>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            {VIBES.map((vibe, idx) => (
                                <div
                                    key={vibe.label}
                                    className={cn(
                                        "relative rounded-2xl overflow-hidden cursor-pointer transition-opacity",
                                        idx === vibeIndex ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                                    )}
                                    onClick={selectVibe}
                                    style={{ display: idx === vibeIndex ? 'block' : 'none' }}
                                >
                                    <img
                                        src={vibe.image}
                                        alt={vibe.label}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <p className="text-white font-medium">{vibe.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevVibeSlide}
                            disabled={vibeIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50"
                        >
                            <ChevronLeft className="h-6 w-6 text-settlr-green" />
                        </button>
                        <button
                            onClick={nextVibeSlide}
                            disabled={vibeIndex === VIBES.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg disabled:opacity-50"
                        >
                            <ChevronRight className="h-6 w-6 text-settlr-green" />
                        </button>
                    </div>
                </div>
            )}

            {/* Budget Sliders */}
            {step === 'BUDGET' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-medium">What's Your Budget?</h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">Min</span>
                                <span className="font-bold text-settlr-green">KES {selections.minBudget.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="100000"
                                step="5000"
                                value={selections.minBudget}
                                onChange={(e) => setSelections({ ...selections, minBudget: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-settlr-green"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">Max</span>
                                <span className="font-bold text-settlr-green">KES {selections.maxBudget.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="200000"
                                step="5000"
                                value={selections.maxBudget}
                                onChange={(e) => setSelections({ ...selections, maxBudget: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-settlr-green"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={() => setStep('DATE')}
                        className="w-full bg-settlr-green text-black hover:bg-settlr-green/90 h-12 font-bold rounded-full"
                    >
                        Continue
                    </Button>
                </div>
            )}

            {/* Move-in Date */}
            {step === 'DATE' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-medium">When are you moving?</h2>
                    <div className="space-y-3">
                        {MOVE_DATES.map((date) => (
                            <button
                                key={date}
                                onClick={() => handleSelect('date', date)}
                                className={cn(
                                    "w-full py-4 px-6 rounded-full border-2 border-settlr-green font-medium transition-colors",
                                    selections.date === date ? "bg-settlr-green text-white" : "bg-white text-black"
                                )}
                            >
                                {date}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Non-Negotiables */}
            {step === 'TAGS' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-medium">Non-Negotiables?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {TAGS.map((tag) => (
                            <div
                                key={tag}
                                onClick={() => handleSelect('tags', tag)}
                                className={cn(
                                    "cursor-pointer rounded-full border-2 p-4 text-center font-medium transition-colors",
                                    selections.tags.includes(tag)
                                        ? "border-settlr-green bg-settlr-green text-white"
                                        : "border-gray-300 bg-white text-black"
                                )}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={() => setStep('LOCATION')}
                        className="w-full bg-settlr-green text-black hover:bg-settlr-green/90 h-12 font-bold rounded-full"
                    >
                        Continue
                    </Button>
                </div>
            )}

            {/* Location */}
            {step === 'LOCATION' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold inline-flex items-center gap-2">
                            Finally, <span className="text-4xl">😁</span>
                        </h2>
                    </div>

                    <h3 className="text-xl font-bold">What is your Preferred Location</h3>

                    <input
                        id="location-input"
                        type="text"
                        placeholder="eg Nairobi"
                        value={selections.location}
                        onChange={(e) => setSelections({ ...selections, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-settlr-green"
                    />

                    {/* Google Map */}
                    <div
                        ref={mapRef}
                        className="h-64 rounded-2xl overflow-hidden bg-gray-200"
                    >
                        {!mapsLoaded && (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Loading map...
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <span className="text-xl">ℹ️</span>
                        <p>We will recommend units within a 2km radius</p>
                    </div>

                    <Button
                        onClick={finishQuiz}
                        className="w-full bg-settlr-green text-white hover:bg-settlr-green/90 h-14 font-bold rounded-full text-lg"
                    >
                        Proceed
                    </Button>
                </div>
            )}

        </div>
    );
}
