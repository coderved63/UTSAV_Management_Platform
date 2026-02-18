import { Resend } from 'resend';

const resendValue = process.env.RESEND_API_KEY;
const resend = resendValue ? new Resend(resendValue) : null;

export async function sendInvitationEmail(
  to: string,
  inviteLink: string,
  organizationName: string
) {
  if (!resend) {
    console.warn('Email service not configured (RESEND_API_KEY missing). Skipping email.');
    return { error: 'Email service not configured' };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'UTSAV <onboarding@resend.dev>';
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `You're invited to join ${organizationName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1a202c;">You've been invited to join ${organizationName}</h2>
          <p style="font-size: 16px; color: #4a5568;">
            Click the button below to accept your invitation.
          </p>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #ff7a18; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="font-size: 14px; color: #718096;">
            This link expires in 48 hours.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #718096;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { error };
    }

    return { data };
  } catch (err: any) {
    console.error('Error in sendInvitationEmail:', err);
    return { error: err.message || 'Unknown email error' };
  }
}
