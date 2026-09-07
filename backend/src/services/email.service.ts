import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!env.smtp.user) {
    console.log(`[EMAIL] Would send to ${options.to}: ${options.subject}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
  await sendEmail({
    to,
    subject: '🔮 Your Bea magic link',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2>Sign in to Bea</h2>
        <p>Click the link below to sign in. This link expires in ${env.magicLinkExpiresMinutes} minutes.</p>
        <a href="${magicLink}" style="display:inline-block;padding:12px 24px;background:#7C3AED;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Sign In to Bea
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Sign in to Bea: ${magicLink}`,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await sendEmail({
    to,
    subject: '🔑 Reset your Bea password',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#7C3AED;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Reset your Bea password: ${resetLink}`,
  });
}

export async function sendWelcomeEmail(to: string, fullName: string, referralLink: string): Promise<void> {
  await sendEmail({
    to,
    subject: '🎉 Welcome to Bea!',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2>Welcome to Bea, ${fullName}! 🎉</h2>
        <p>You're on the waitlist! Share your referral link to move up and win prizes.</p>
        <a href="${referralLink}" style="display:inline-block;padding:12px 24px;background:#7C3AED;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Share Your Link
        </a>
        <p>Your referral link: <strong>${referralLink}</strong></p>
      </div>
    `,
    text: `Welcome to Bea! Share your link: ${referralLink}`,
  });
}

export async function sendAmbassadorInviteEmail(to: string, inviterName: string, inviteLink: string): Promise<void> {
  await sendEmail({
    to,
    subject: `${inviterName} invited you to join Bea as an Ambassador! 🤝`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2>You've been invited!</h2>
        <p><strong>${inviterName}</strong> invited you to join Bea as an Ambassador.</p>
        <p>Complete your profile and start earning rewards!</p>
        <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;background:#7C3AED;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Accept Invitation
        </a>
      </div>
    `,
    text: `${inviterName} invited you to Bea: ${inviteLink}`,
  });
}
