import globals from '@/env/env';
import nodemailer from 'nodemailer';

export async function sendEmail(html: string, to: string) {
    const transporter = nodemailer.createTransport({
        host: globals.env.MAIL_SERVER,
        port: globals.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: globals.env.MAIL_USER,
            pass: globals.env.MAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: globals.env.MAIL_FROM,
        to: to,
        subject: 'Lien magique - Créer ton compte',
        html: html,
    });
} 