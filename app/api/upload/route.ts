import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError } from '@/lib/security';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'text/plain',
  'image/jpeg',
  'image/png',
]);

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await requireUser(request);
    enforceRateLimit(request, 'upload', 20, 60 * 60 * 1000);
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      throw new ApiError(415, 'Only multipart file uploads are supported');
    }

    const appId = process.env.APP_ID;
    const uploadSecret = process.env.APP_UPLOAD_SECRET;
    const uploadUrl = process.env.APPGEN_UPLOAD_URL;
    if (!appId || !uploadSecret || !uploadUrl) {
      throw new ApiError(503, 'Upload service is not configured');
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) throw new ApiError(400, 'A file is required');
    if (file.size < 1 || file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'File exceeds the 10 MB limit');
    if (!ALLOWED_TYPES.has(file.type)) throw new ApiError(415, 'Unsupported file type');

    const outbound = new FormData();
    outbound.append('file', file, file.name);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'x-app-id': appId, 'x-upload-secret': uploadSecret },
      body: outbound,
    });
    if (!response.ok) throw new ApiError(502, 'Upload provider rejected the file');

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
