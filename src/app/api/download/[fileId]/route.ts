import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // 1. Verify Clerk User Authentication
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized: Please sign in to access your purchased files.', {
        status: 401,
      });
    }

    const { fileId } = await params;

    // 2. Map fileId to actual physical files
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

    // 3. Locate file path securely
    const filePath = path.join(process.cwd(), 'public', 'images', targetFile.filename);

    if (!fs.existsSync(filePath)) {
      // Fallback response if file path is missing
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
