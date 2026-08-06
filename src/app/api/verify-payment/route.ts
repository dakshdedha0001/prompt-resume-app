import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth, clerkClient } from '@clerk/nextjs/server';

// Handle Razorpay Post-Payment Redirect (GET Request from Browser Redirect)
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const url = new URL(req.url);

    if (userId) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          has_paid: true,
          paid_at: new Date().toISOString(),
        },
        unsafeMetadata: {
          has_paid: true,
        },
      });
    }

    return NextResponse.redirect(new URL('/dashboard?paid=true', url.origin));
  } catch (error: any) {
    console.error('GET Verify Payment Error:', error);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}

// Handle Standard Checkout Verification (POST Request)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate all 3 required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification fields (order_id, payment_id, signature).' },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      console.error('RAZORPAY_KEY_SECRET missing from environment variables');
      return NextResponse.json(
        { success: false, message: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Signature mismatch. Payment verification failed.' },
        { status: 400 }
      );
    }

    // Signature verified — Mark user as PAID in Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        has_paid: true,
        paid_at: new Date().toISOString(),
        razorpay_payment_id,
        razorpay_order_id,
      },
      unsafeMetadata: {
        has_paid: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and toolkit unlocked!',
    });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error during verification' },
      { status: 500 }
    );
  }
}
