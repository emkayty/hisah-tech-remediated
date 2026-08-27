import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { requirePermission } from '@/lib/rbac';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError } from '@/lib/security';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream', 'text/plain', 'image/jpeg', 'image/png']);

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requirePermission(request, 'files.manage');
    await enforceRateLimit(request, 'admin-upload', 40, 60 * 60 * 1000);
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) throw new ApiError(415, 'Only multipart file uploads are supported');
    const appId = process.env.APP_ID; const uploadSecret = process.env.APP_UPLOAD_SECRET; const uploadUrl = process.env.APPGEN_UPLOAD_URL;
    if (!appId || !uploadSecret || !uploadUrl) throw new ApiError(503, 'Upload service is not configured');
    const formData = await request.formData(); const file = formData.get('file');
    if (!(file instanceof File)) throw new ApiError(400, 'A file is required');
    if (file.size < 1 || file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'File exceeds the 50 MB limit');
    if (!ALLOWED_TYPES.has(file.type)) throw new ApiError(415, 'Unsupported file type');
    const outbound = new FormData(); outbound.append('file', file, file.name);
    const upstream = await fetch(uploadUrl, { method: 'POST', headers: { 'x-app-id': appId, 'x-upload-secret': uploadSecret }, body: outbound });
    if (!upstream.ok) throw new ApiError(502, 'Upload provider rejected the file');
    const uploaded = await upstream.json(); const storageUrl = uploaded.url || uploaded.file?.url || uploaded.location || '';
    if (!storageUrl) throw new ApiError(502, 'Upload provider returned no file URL');
    const category = String(formData.get('category') || 'firmware').trim().slice(0, 80); const description = String(formData.get('description') || '').trim().slice(0, 500);
    const database = getDatabase(); const rows = await database`INSERT INTO files (filename, category, description, file_size, uploaded_by, storage_url, created_at) VALUES (${file.name}, ${category || 'firmware'}, ${description}, ${file.size}, ${admin.id}, ${storageUrl}, NOW()) RETURNING id, filename, category, description, file_size, downloads, storage_url, created_at`;
    return NextResponse.json({ file: rows[0] });
  } catch (error) { return apiError(error); }
}
