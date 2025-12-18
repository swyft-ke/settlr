import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        return NextResponse.json({ success: true, tourId: "1290" });
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ success: true, tours: [] });
}
