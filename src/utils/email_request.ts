import nodemailer from 'nodemailer';
import { welcomeTemplate, otpTemplate, adAlertTemplate, verifyEmailTemplate, emailDefaultTemplete } from './email_templates';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

async function sendWelcomeEmail(_to:string, _subject:string, name:string){
  const mailOptions = {
    from: `9Life Team <${process.env.EMAIL_ADDRESS}>`,
    to: _to,
    subject: _subject,
    html: welcomeTemplate(name)
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

async function sendEmail(_to:string, title:string, content: string){
  const mailOptions = {
    from: `9Life Team <${process.env.EMAIL_ADDRESS}>`,
    to: _to,
    subject: title,
    html: emailDefaultTemplete(title, content)
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

async function sendAdAlertEmail(_to:string, _subject:string, mail:string){
  const mailOptions = {
    from: `9Life Team <${process.env.EMAIL_ADDRESS}>`,
    to: _to,
    subject: _subject,
    html: adAlertTemplate(mail)
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

async function sendEmailOtp(_to:string, _subject:string, otp:number){
  const mailOptions = {
    from: `9Life Team <${process.env.EMAIL_ADDRESS}>`,
    to: _to,
    subject: _subject,
    html: otpTemplate(otp, _to)
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

async function sendVerifyEmailOtp(_to:string, _subject:string, otp:number, user:string){
  const mailOptions = {
    from: `9Life Team <${process.env.EMAIL_ADDRESS}>`,
    to: _to,
    subject: _subject,
    html: verifyEmailTemplate(otp, _to, user)
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

export {sendWelcomeEmail, sendEmailOtp, sendEmail, sendAdAlertEmail, sendVerifyEmailOtp}