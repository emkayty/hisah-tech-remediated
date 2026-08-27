import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin } from '@/lib/auth';
import { requirePermission } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';
import { apiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const settingsSchema = z.object({
  provider: z.enum(['stripe', 'paypal', 'paystack', 'crypto']),
  enabled: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'payments.manage');
    const database = getDatabase();
    const settings = await database`
      SELECT provider, enabled, updated_at
      FROM payment_settings
      ORDER BY provider
    `;
    return NextResponse.json({ settings });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requirePermission(request, 'payments.manage');
    const { provider, enabled } = await parseJson(request, settingsSchema);
    const database = getDatabase();
    await database`
      UPDATE payment_settings
      SET enabled = ${enabled}, updated_at = NOW(), updated_by = ${admin.id}
      WHERE provider = ${provider}
    `;
    return NextResponse.json({ success: true, message: `${provider} status updated` });
  } catch (error) {
    return apiError(error);
  }
}
