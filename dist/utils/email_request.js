"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendOtp = sendOtp;
exports.sendAdAlertEmail = sendAdAlertEmail;
exports.sendVerifyEmailOtp = sendVerifyEmailOtp;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = require("./email_templates");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD,
    },
});
async function sendEmail(_to, _subject, name) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: _to,
        subject: _subject,
        html: (0, email_templates_1.welcomeTemplate)(name)
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
}
async function sendAdAlertEmail(_to, _subject, mail) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: _to,
        subject: _subject,
        html: (0, email_templates_1.adAlertTemplate)(mail)
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
}
async function sendOtp(_to, _subject, otp) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: _to,
        subject: _subject,
        html: (0, email_templates_1.otpTemplate)(otp, _to)
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
}
async function sendVerifyEmailOtp(_to, _subject, otp) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: _to,
        subject: _subject,
        html: (0, email_templates_1.verifyEmailTemplate)(otp, _to)
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
}
