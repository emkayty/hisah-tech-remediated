import { Resend } from 'resend';

const from = process.env.EMAIL_FROM;
const resendApiKey = process.env.RESEND_API_KEY;

function client(): Resend | null {
  return resendApiKey ? new Resend(resendApiKey) : null;
}

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<void> {
  const resend = client();
  if (!resend || !from) {
    return;
  }

  await resend.emails.send({
    from,
    to: email,
    subject: 'Welcome to Hisah Tech',
    text: `Hello ${name?.trim() || 'there'}, your account is ready.`,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const resend = client();
  if (!resend || !from) {
    throw new Error('Password reset email is not configured');
  }

  await resend.emails.send({
    from,
    to: email,
    subject: 'Reset your Hisah Tech password',
    text: `Use this one-time link to reset your password: ${resetUrl}`,
  });
}

export async function sendEmailAddressChanged(previousEmail: string, name?: string | null): Promise<void> {
  const resend = client();
  if (!resend || !from) {
    return;
  }

  await resend.emails.send({
    from,
    to: previousEmail,
    subject: 'Your Hisah Tech email address was changed',
    text: `Hello ${name?.trim() || 'there'}, the email address on your account was changed. If you did not make this change, reset your password and contact support immediately.`,
  });
}
