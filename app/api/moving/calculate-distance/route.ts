import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { origin, destination } = body;

        if (!origin || !destination) {
            return NextResponse.json(
                { success: false, error: 'Origin and destination are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'Google Maps API key not configured' },
                { status: 500 }
            );
        }

        // Call Google Maps Distance Matrix API
        const originEncoded = encodeURIComponent(origin);
        const destEncoded = encodeURIComponent(destination);

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originEncoded}&destinations=${destEncoded}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            return NextResponse.json(
                { success: false, error: `Distance Matrix API error: ${data.status}` },
                { status: 500 }
            );
        }

        const element = data.rows[0]?.elements[0];

        if (!element || element.status !== 'OK') {
            return NextResponse.json(
                { success: false, error: 'Could not calculate distance between locations' },
                { status: 400 }
            );
        }

        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;

        return NextResponse.json({
            success: true,
            distanceKm: distanceMeters / 1000,
            durationMinutes: Math.round(durationSeconds / 60),
            distanceText: element.distance.text,
            durationText: element.duration.text,
        });
    } catch (error) {
        console.error('Error calculating distance:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
