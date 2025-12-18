import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, amount } = body;

        // Validate input
        if (!phone || !amount) {
            return NextResponse.json(
                { success: false, message: 'Phone and amount are required' },
                { status: 400 }
            );
        }

        // In production, call Lipana API to initiate STK push
        // const response = await fetch('https://api.lipana.dev/v1/transactions/push-stk', {
        //   method: 'POST',
        //   headers: {
        //     'x-api-key': process.env.LIPANA_SECRET_KEY!,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ phone, amount })
        // });
        //
        // const data = await response.json();
        // return NextResponse.json(data);

        // Mock response for now
        return NextResponse.json({
            success: true,
            message: 'STK push initiated successfully',
            data: {
                transactionId: `TXN${Date.now()}`,
                status: 'pending',
                checkoutRequestID: `ws_CO_${Date.now()}`,
                message: 'STK push sent to your phone. Please complete the payment on your phone.'
            }
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
