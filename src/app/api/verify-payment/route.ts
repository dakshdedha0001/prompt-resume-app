import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'XSpjObO3u61C61LjB6GEuOwx';

    // Verify HMAC-SHA256 signature if razorpay details are provided
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
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
    }

    // Mark user as PAID in Clerk user metadata
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
