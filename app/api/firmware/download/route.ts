import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const model = searchParams.get('model');

    if (!model) {
      return NextResponse.json(
        { error: 'Model parameter is required' },
        { status: 400 }
      );
    }

    // Sanitize model name
    const sanitizedModel = model.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    
    // Path to firmware files
    const firmwarePath = join(process.cwd(), 'public', 'firmware', `${sanitizedModel}_windows.bin`);

    // Check if file exists
    if (!existsSync(firmwarePath)) {
      return NextResponse.json(
        { error: `Firmware not found for model: ${model}` },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(firmwarePath);

    // Return the file as a download
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${sanitizedModel}_windows.bin"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Firmware download error:', error);
    return NextResponse.json(
      { error: 'Failed to download firmware' },
      { status: 500 }
    );
  }
}
