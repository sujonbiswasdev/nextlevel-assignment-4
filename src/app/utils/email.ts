/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";

const smtpPort = Number(envVars.EMAIL_SENDER.SMTP_PORT);
const transporter = nodemailer.createTransport({
    host : envVars.EMAIL_SENDER.SMTP_HOST,
    port: smtpPort,
    // Port 465 expects implicit TLS (secure=true). Port 587/25 typically uses STARTTLS (secure=false).
    secure: smtpPort === 465,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
})

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[]
}

export const sendEmail = async ({subject, templateData, templateName, to, attachments} : SendEmailOptions) => {
    try {
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

        const html = await ejs.renderFile(templatePath, templateData);

        const info = await transporter.sendMail({
            from: `Planora <${envVars.EMAIL_SENDER.SMTP_USER}>`,
            to : to,
            subject : subject,
            html : html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            }))
        })

        console.log(`Email sent to ${to} : ${info.messageId}`);
    } catch (error : any) {
        console.log("Email Sending Error", {
            message: error?.message,
            code: error?.code,
            command: error?.command,
            responseCode: error?.responseCode,
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
}