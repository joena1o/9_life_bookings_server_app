import nodemailer from 'nodemailer';
import { welcomeTemplate, otpTemplate, adAlertTemplate, verifyEmailTemplate } from './email_templates';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

async function sendEmail(_to:string, _subject:string, name:string){
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
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

async function sendAdAlertEmail(_to:string, _subject:string, mail:string){
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
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

async function sendOtp(_to:string, _subject:string, otp:number){
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
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

async function sendVerifyEmailOtp(_to:string, _subject:string, otp:number){
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: _to,
    subject: _subject,
    html: verifyEmailTemplate(otp, _to)
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

export {sendEmail, sendOtp, sendAdAlertEmail, sendVerifyEmailOtp}