import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update Clerk User Metadata to mark user as PAID
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

    return NextResponse.json({ success: true, message: 'Payment verified and toolkit access unlocked!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
