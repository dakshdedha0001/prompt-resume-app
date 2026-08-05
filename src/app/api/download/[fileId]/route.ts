import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // 1. Verify Clerk User Authentication
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized: Please sign in to access download files.', {
        status: 401,
      });
    }

    // 2. Strict Payment Verification Check
    const hasPaid =
      user.publicMetadata?.has_paid === true ||
      user.unsafeMetadata?.has_paid === true;

    if (!hasPaid) {
      return new NextResponse(
        'Forbidden: Complete the ₹99 payment to unlock download access.',
        { status: 403 }
      );
    }

    const { fileId } = await params;

    // 3. Map fileId to actual physical files
    const fileMap: Record<string, { filename: string; contentType: string }> = {
      ebook: {
        filename: 'The_AI_Resume_Blueprint.pdf',
        contentType: 'application/pdf',
      },
      'template-classic': {
        filename: 'ATS_Classic_Template.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      'template-modern': {
        filename: 'ATS_Modern_Template.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      'template-internship': {
        filename: 'Internship_Resume_Template.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    };

    const targetFile = fileMap[fileId];

    if (!targetFile) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 4. Locate file path securely
    const filePath = path.join(process.cwd(), 'public', 'images', targetFile.filename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File temporary unavailable. Please contact support.', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': targetFile.contentType,
        'Content-Disposition': `attachment; filename="${targetFile.filename}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
