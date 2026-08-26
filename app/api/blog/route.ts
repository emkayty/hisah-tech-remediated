import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';
export async function GET() { try { const database = getDatabase(); const posts = await database`SELECT id, slug, title, excerpt, category, cover_image_url, published_at, updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST, id DESC LIMIT 100`; return NextResponse.json({ posts }); } catch (error) { return apiError(error); } }
