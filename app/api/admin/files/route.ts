import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try { await requireAdmin(request); const database = getDatabase(); const files = await database`SELECT id, filename, category, description, file_size, downloads, uploaded_by, created_at FROM files ORDER BY created_at DESC LIMIT 200`; return NextResponse.json({ files }); }
  catch (error) { return apiError(error); }
}
