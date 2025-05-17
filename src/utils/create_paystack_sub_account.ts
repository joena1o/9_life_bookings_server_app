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
          "Authorization": `Bearer ${process.env.TEST_SECRET_KEY}`
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
      reference: string, recipient:string
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
              "Authorization": `Bearer ${process.env.TEST_SECRET_KEY}`
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
          "Authorization": `Bearer ${process.env.TEST_SECRET_KEY}`
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


//   export const updatePayStackAccount = async (business_name: string, bank_code: string,
//     account_number: string, percentage_charge: number, sub_account: string
//     ): Promise<any> => {
//         const data = {
//           business_name,
//           bank_code,
//           account_number,
//           percentage_charge,
//           sub_account,
//         };
      
//         const options: AxiosRequestConfig = {
//           method: "PUT",
//           url: `${process.env.PAYSTACK_API}/subaccount/${sub_account}`,
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.TEST_SECRET_KEY}`
//           },
//           data,
//         };
      
//         try {
//           const response = await axios(options);
//           return response.data;
//         } catch (error) {
//             console.log(error);
//           throw new Error(`Error verifying OTP: ${error}`);
//         }
//       };