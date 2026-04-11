import status from "http-status";
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { generateEmailTemplate } from "../templates/htmlEmailTemplete";


const smtpConfig = {
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465, // true for 465, false for others
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 30_000,
};

const transporter = nodemailer.createTransport(smtpConfig);

interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: Attachment[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `foodhub <${envVars.EMAIL_SENDER.SMTP_USER}>`,
      to,
      subject,
      html: generateEmailTemplate(templateName, templateData),
      attachments: attachments?.map(({ filename, content, contentType }) => ({
        filename,
        content,
        contentType,
      })),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error: any) {
    console.error("Email Sending Error", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
    });
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};