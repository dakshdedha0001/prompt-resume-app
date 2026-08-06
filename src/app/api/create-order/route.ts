import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TMPbTHK6smTVy5';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'z0HntokTFSl2ednnbbDkfw81';

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: 100, // ₹1 in paise (100 paise) for testing purpose
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
