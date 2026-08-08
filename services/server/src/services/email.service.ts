import * as nodemailer from 'nodemailer';
import { config } from '../config/env';

export interface EmailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
    cid?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor() {
    const host = config.email.host;
    const port = config.email.port;
    const secure = config.email.secure;
    const user = config.email.user;
    const pass = config.email.pass;

    this.defaultFrom = config.email.from || user || 'no-reply@rental.com';

    const transportOptions = {
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    } as nodemailer.TransportOptions;

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email transporter ready');
      return true;
    } catch (error) {
      console.error('Email transporter verification failed:', error);
      return false;
    }
  }

  async sendMail(options: EmailOptions): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: options.from || this.defaultFrom,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();

const getVerificationEmailHtml = (
  otp: string,
  recipientName: string,
  webName: string,
  webUrl: string
): string => {
  return `
        <html>
          <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;color:#111827;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                    <tr>
                      <td style="padding:32px;text-align:center;background:#1f2937;color:#ffffff;">
                        <h1 style="margin:0;font-size:28px;letter-spacing:-0.02em;">${webName}</h1>
                        <p style="margin:12px 0 0;font-size:16px;color:#d1d5db;">Your one-time verification code</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px;">
                        <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#374151;">Hi ${recipientName || 'there'},</p>
                        <p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:#374151;">Use the code below to complete your sign-in or verify your email address for <strong>${webName}</strong>. This code expires in 10 minutes.</p>
                        <div style="text-align:center;margin:0 0 24px;padding:24px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">
                          <p style="margin:0;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.12em;">Your OTP Code</p>
                          <p style="margin:12px 0 0;font-size:40px;font-weight:700;letter-spacing:0.16em;color:#111827;">${otp}</p>
                        </div>
                        <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#6b7280;">If you did not request this code, you can safely ignore this email.</p>
                        <a href="${webUrl}" style="display:inline-block;padding:14px 24px;background:#2563eb;color:#ffffff;border-radius:12px;text-decoration:none;font-weight:600;">Visit ${webName}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 32px 32px;background:#f8fafc;color:#6b7280;font-size:14px;line-height:1.75;">
                        <p style="margin:0;">Need help? Reply to this email or visit <a href="${webUrl}" style="color:purple;text-decoration:none;">${webName}</a>.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
    `;
};

const getVerificationEmailText = (
  otp: string,
  recipientName: string,
  webName: string,
  webUrl: string
): string => {
  return (
    `Hello ${recipientName || 'there'},\n\n` +
    `Your ${webName} verification code is ${otp}. It expires in 10 minutes.\n\n` +
    `If you did not request this code, please ignore this email.\n\n` +
    `Visit ${webUrl} to continue.`
  );
};

export const sendVerificationOTP = async (
  to: string,
  otp: string,
  recipientName = 'there'
): Promise<nodemailer.SentMessageInfo> => {
  const webName = config.web.name || 'Rental Management System';
  const webUrl = config.web.url || 'http://localhost:3000';
  const subject = `${webName} Verification Code`;
  const html = getVerificationEmailHtml(otp, recipientName, webName, webUrl);
  const text = getVerificationEmailText(otp, recipientName, webName, webUrl);

  return emailService.sendMail({
    to,
    subject,
    text,
    html,
  });
};

export const sendRentalConfirmationEmail = async (
  to: string,
  rentalDetails: any
): Promise<nodemailer.SentMessageInfo> => {
  const webName = config.web.name || 'Rental Management System';
  const subject = `Rental Confirmation - ${rentalDetails.rental_number}`;
  const html = `
        <h1>Rental Confirmed</h1>
        <p>Your rental has been confirmed.</p>
        <ul>
            <li>Rental Number: ${rentalDetails.rental_number}</li>
            <li>Product: ${rentalDetails.product_name}</li>
            <li>Start Date: ${rentalDetails.start_date}</li>
            <li>End Date: ${rentalDetails.end_date}</li>
            <li>Total: $${rentalDetails.total_amount}</li>
        </ul>
    `;

  return emailService.sendMail({
    to,
    subject,
    html,
  });
};
