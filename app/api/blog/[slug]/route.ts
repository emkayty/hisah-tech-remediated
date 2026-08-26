import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) { try { const { slug } = await params; const database = getDatabase(); const rows = await database`SELECT id, slug, title, excerpt, body, category, cover_image_url, published_at, updated_at FROM blog_posts WHERE slug = ${slug} AND status = 'published' LIMIT 1`; if (!rows.length) return NextResponse.json({ error: 'Article not found' }, { status: 404 }); return NextResponse.json({ post: rows[0] }); } catch (error) { return apiError(error); } }
