import axios, { AxiosRequestConfig } from "axios";
import dotenv from 'dotenv';
dotenv.config();


export const createReceiptCode = async (business_name: string, bank_code: string,
  account_number: string
): Promise<any> => {
  const data = {
    type: "nuban",
    name: business_name,
    bank_code,
    account_number,
    currency: "NGN",
  };

  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.PAYSTACK_API}/transferrecipient`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
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

export const updateReceiptCode = async (business_name: string, bank_code: string,
  account_number: string, code: string
): Promise<any> => {
  const data = {
    type: "nuban",
    name: business_name,
    bank_code,
    account_number,
    currency: "NGN",
  };

  const options: AxiosRequestConfig = {
    method: "PUT",
    url: `${process.env.PAYSTACK_API}/transferrecipient/${code}`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
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

export const disburseFund = async (reason: string, amount: Number,
  reference: string, recipient: string
): Promise<any> => {
  const data = {
    source: "balance",
    reason,
    amount,
    reference,
    recipient,
  };
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.PAYSTACK_API}/transfer`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
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

export const finalizePaystackTransfer = async (transfer_code: string,
  otp: string
): Promise<any> => {
  const data = {
    transfer_code,
    otp
  };

  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.PAYSTACK_API}/transfer/finalize_transfer`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
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


export const getBankList = async (): Promise<any> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${process.env.PAYSTACK_API}/bank`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
    },
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error retriving banks: ${error}`);
  }
};