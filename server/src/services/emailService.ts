import nodemailer from 'nodemailer';
import { config } from '../config';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailOptions {
  to: string;
  template: EmailTemplate;
  variables?: Record<string, string>;
}

// Email templates
export const emailTemplates = {
  passwordReset: (resetLink: string, username: string): EmailTemplate => ({
    subject: 'Reset Your OwnCent Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>You requested a password reset for your OwnCent account. Click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          OwnCent - Personal Finance Management<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
    text: `
Password Reset Request

Hello ${username},

You requested a password reset for your OwnCent account. 

Reset your password here: ${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request this reset, please ignore this email.

---
OwnCent - Personal Finance Management
This is an automated message, please do not reply.
    `
  }),

  emailVerification: (verificationLink: string, username: string): EmailTemplate => ({
    subject: 'Verify Your OwnCent Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Welcome to OwnCent!</h2>
        <p>Hello ${username},</p>
        <p>Thank you for creating your OwnCent account. Please verify your email address to complete your registration:</p>
        <p style="margin: 20px 0;">
          <a href="${verificationLink}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Verify Email Address
          </a>
        </p>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          OwnCent - Personal Finance Management<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
    text: `
Welcome to OwnCent!

Hello ${username},

Thank you for creating your OwnCent account. Please verify your email address to complete your registration:

Verify your email here: ${verificationLink}

This link will expire in 24 hours for security reasons.

If you didn't create this account, please ignore this email.

---
OwnCent - Personal Finance Management
This is an automated message, please do not reply.
    `
  }),

  loginAlert: (loginDetails: { ip: string; userAgent: string; timestamp: string }): EmailTemplate => ({
    subject: 'New Login to Your OwnCent Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">New Login Detected</h2>
        <p>A new login was detected on your OwnCent account:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Time:</strong> ${loginDetails.timestamp}</p>
          <p><strong>IP Address:</strong> ${loginDetails.ip}</p>
          <p><strong>Device:</strong> ${loginDetails.userAgent}</p>
        </div>
        <p>If this was you, no action is needed.</p>
        <p>If you don't recognize this login, please secure your account immediately by changing your password.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          OwnCent - Personal Finance Management<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
    text: `
New Login Detected

A new login was detected on your OwnCent account:

Time: ${loginDetails.timestamp}
IP Address: ${loginDetails.ip}
Device: ${loginDetails.userAgent}

If this was you, no action is needed.

If you don't recognize this login, please secure your account immediately by changing your password.

---
OwnCent - Personal Finance Management
This is an automated message, please do not reply.
    `
  })
};

// Create email transporter
const createTransporter = () => {
  if (config.env === 'development') {
    // Use Ethereal for development testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  // Production SMTP configuration
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword
    }
  });
};

// Replace template variables
const processTemplate = (template: EmailTemplate, variables: Record<string, string> = {}): EmailTemplate => {
  let { subject, html, text } = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    html = html.replace(new RegExp(placeholder, 'g'), value);
    text = text.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, html, text };
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    const template = processTemplate(options.template, options.variables);
    
    const mailOptions = {
      from: config.emailFrom,
      to: options.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    };

    if (config.env === 'development') {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: template.subject,
        preview: template.text.substring(0, 100) + '...'
      });
      return;
    }

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${options.to}: ${template.subject}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email delivery failed');
  }
};

export const sendPasswordResetEmail = async (
  email: string, 
  username: string, 
  resetToken: string
): Promise<void> => {
  const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const template = emailTemplates.passwordReset(resetLink, username);
  
  await sendEmail({
    to: email,
    template,
    variables: { username, resetLink }
  });
};

export const sendEmailVerification = async (
  email: string, 
  username: string, 
  verificationToken: string
): Promise<void> => {
  const verificationLink = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
  const template = emailTemplates.emailVerification(verificationLink, username);
  
  await sendEmail({
    to: email,
    template,
    variables: { username, verificationLink }
  });
};

export const sendLoginAlert = async (
  email: string, 
  loginDetails: { ip: string; userAgent: string; timestamp: string }
): Promise<void> => {
  const template = emailTemplates.loginAlert(loginDetails);
  
  await sendEmail({
    to: email,
    template,
    variables: loginDetails
  });
};