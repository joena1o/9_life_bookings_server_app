import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
dotenv.config();

const verifyOtp = async (pinId: string, pin: string): Promise<any> => {
  const data = {
    api_key: process.env.TERMII_API_KEY,
    pin_id: pinId,
    pin: pin,
  };

  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.TERMII_BASE_URL}/api/sms/otp/verify`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`Error verifying OTP: ${error}`);
  }
};

const sendOtp = async (to: string, pin: number): Promise<any> => {
  const data = {
    api_key: process.env.TERMII_API_KEY,
    message_type: "NUMERIC",
    to,
    from: "9LifeBookings",
    channel: "generic",
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 4,
    pin_placeholder: pin,
    message_text: `Your 9Life Bookings Confirmation Code is ${pin}. it expires in 5 minutes.`,
    pin_type: "NUMERIC",
  };
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.TERMII_BASE_URL}/api/sms/otp/send`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error verifying OTP: ${error}`);
  }
};

export { verifyOtp, sendOtp };
