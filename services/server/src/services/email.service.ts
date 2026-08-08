// declare module 'nodemailer';
import * as nodemailer from 'nodemailer';

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
        const host = process.env.EMAIL_HOST || 'localhost';
        const port = Number(process.env.EMAIL_PORT || 587);
        const secure = process.env.EMAIL_SECURE === 'true';
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        this.defaultFrom = process.env.EMAIL_FROM || user || 'no-reply@example.com';

        const transportOptions: Record<string, any> = {
            host,
            port,
            secure,
        };

        if (user && pass) {
            transportOptions.auth = { user, pass };
        }

        this.transporter = nodemailer.createTransport(transportOptions);
    }

    async verify(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch {
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
