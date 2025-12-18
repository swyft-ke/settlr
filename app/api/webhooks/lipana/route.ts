import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        // Get webhook signature from headers
        const signature = request.headers.get('x-lipana-signature');

        if (!signature) {
            console.log('Missing X-Lipana-Signature header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get raw body as text
        const rawBody = await request.text();

        // Verify signature (when you have LIPANA_WEBHOOK_SECRET in env)
        // const webhookSecret = process.env.LIPANA_WEBHOOK_SECRET!;
        // const expectedSignature = crypto
        //   .createHmac('sha256', webhookSecret)
        //   .update(rawBody)
        //   .digest('hex');

        // if (!crypto.timingSafeEqual(
        //   Buffer.from(signature),
        //   Buffer.from(expectedSignature)
        // )) {
        //   console.log('Invalid webhook signature');
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // Parse the verified payload
        const data = JSON.parse(rawBody);
        const { event, data: eventData } = data;

        console.log('Webhook received:', event, eventData);

        // Process webhook based on event type
        switch (event) {
            case 'payment.success':
            case 'transaction.success':
                console.log('Payment successful:', eventData?.transactionId);
                // TODO: Update database - mark tour as paid
                // TODO: Send confirmation email/SMS to client
                // TODO: Notify assigned scout
                break;

            case 'payment.failed':
            case 'transaction.failed':
                console.log('Payment failed:', eventData?.transactionId);
                // TODO: Update database - mark payment as failed
                // TODO: Notify client of failure
                break;

            case 'payment.cancelled':
            case 'transaction.cancelled':
                console.log('Payment cancelled:', eventData?.transactionId);
                // TODO: Update database - mark payment as cancelled
                break;

            default:
                console.log('Unknown event:', event);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
