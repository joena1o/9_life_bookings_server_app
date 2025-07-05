import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Email service API base URL
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVER_API;

// Configure axios instance
const emailAPI = axios.create({
  baseURL: EMAIL_SERVICE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper function to make API calls
async function makeEmailAPICall(endpoint: string, payload: any) {
  try {
    const response = await emailAPI.post(endpoint, payload);
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const statusCode = error.response?.status || 'Unknown';
      console.error(`Email service error: ${statusCode} - ${errorMessage}`);
      throw new Error(`Email service error: ${statusCode} - ${errorMessage}`);
    } else {
      console.error('Error calling email service:', error);
      throw error;
    }
  }
}

async function sendWelcomeEmail(_to: string, _subject: string, name: string) {
  try {
    if (!_to || !_subject || !name) {
      throw new Error('Missing required parameters: _to, _subject, or name');
    }

    const payload = {
      to: _to,
      subject: _subject,
      name: name
    };

    return await makeEmailAPICall('/send-welcome', payload);
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    throw error;
  }
}

async function sendEmail(_to: string, title: string, content: string) {
  try {
    if (!_to || !title || !content) {
      throw new Error('Missing required parameters: _to, title, or content');
    }

    const payload = {
      to: _to,
      subject: title,
      content: content
    };

    return await makeEmailAPICall('/send-email', payload);
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
}

async function sendAdAlertEmail(_to: string, _subject: string, mail: string) {
  try {
    if (!_to || !_subject || !mail) {
      throw new Error('Missing required parameters: _to, _subject, or mail');
    }

    const payload = {
      to: _to,
      subject: _subject,
      mail: mail
    };

    return await makeEmailAPICall('/send-ad-alert', payload);
  } catch (error) {
    console.error('Error in sendAdAlertEmail:', error);
    throw error;
  }
}

async function sendEmailOtp(_to: string, _subject: string, otp: number) {
  try {
    if (!_to || !_subject || !otp) {
      throw new Error('Missing required parameters: _to, _subject, or otp');
    }

    const payload = {
      to: _to,
      subject: _subject,
      otp: otp
    };

    return await makeEmailAPICall('/send-otp', payload);
  } catch (error) {
    console.error('Error in sendEmailOtp:', error);
    throw error;
  }
}

async function sendVerifyEmailOtp(_to: string, _subject: string, otp: number, user: string) {
  try {
    if (!_to || !_subject || !otp || !user) {
      throw new Error('Missing required parameters: _to, _subject, otp, or user');
    }    
    const payload = {
      to: _to,
      subject: _subject,
      otp: otp,
      user: user
    };
    return await makeEmailAPICall('/send-verify-otp', payload);
  } catch (error) {
    console.error('Error in sendVerifyEmailOtp:', error);
    throw error;
  }
}

export {
  sendWelcomeEmail,
  sendEmailOtp,
  sendEmail,
  sendAdAlertEmail,
  sendVerifyEmailOtp
};