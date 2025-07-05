"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankList = exports.finalizePaystackTransfer = exports.disburseFund = exports.updateReceiptCode = exports.createReceiptCode = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createReceiptCode = async (business_name, bank_code, account_number) => {
    const data = {
        type: "nuban",
        name: business_name,
        bank_code,
        account_number,
        currency: "NGN",
    };
    const options = {
        method: "POST",
        url: `${process.env.PAYSTACK_API}/transferrecipient`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.createReceiptCode = createReceiptCode;
const updateReceiptCode = async (business_name, bank_code, account_number, code) => {
    const data = {
        type: "nuban",
        name: business_name,
        bank_code,
        account_number,
        currency: "NGN",
    };
    const options = {
        method: "PUT",
        url: `${process.env.PAYSTACK_API}/transferrecipient/${code}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.updateReceiptCode = updateReceiptCode;
const disburseFund = async (reason, amount, reference, recipient) => {
    const data = {
        source: "balance",
        reason,
        amount,
        reference,
        recipient,
    };
    const options = {
        method: "POST",
        url: `${process.env.PAYSTACK_API}/transfer`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.disburseFund = disburseFund;
const finalizePaystackTransfer = async (transfer_code, otp) => {
    const data = {
        transfer_code,
        otp
    };
    const options = {
        method: "POST",
        url: `${process.env.PAYSTACK_API}/transfer/finalize_transfer`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.finalizePaystackTransfer = finalizePaystackTransfer;
const getBankList = async () => {
    const options = {
        method: "GET",
        url: `${process.env.PAYSTACK_API}/bank`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error retriving banks: ${error}`);
    }
};
exports.getBankList = getBankList;
