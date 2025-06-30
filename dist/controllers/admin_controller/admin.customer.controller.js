"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserAnEmail = exports.suspendUser = exports.fetchCustomers = void 0;
const user_model_1 = __importDefault(require("../../models/user_model"));
const email_request_1 = require("../../utils/email_request");
const fetchCustomers = async (req, res) => {
    try {
        let fetchUsers = await user_model_1.default.find();
        return res.status(200).json({ message: "Customers", data: fetchUsers });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.fetchCustomers = fetchCustomers;
const suspendUser = async (req, res) => {
    try {
        const { id, status } = req.body;
        let suspendUser = await user_model_1.default.findOneAndUpdate({ _id: id }, { suspended: status }, { new: true });
        return res.status(200).json({ message: "Customers",
            data: suspendUser });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.suspendUser = suspendUser;
const sendUserAnEmail = async (req, res) => {
    try {
        const { content, title, email } = req.body;
        await (0, email_request_1.sendEmail)(email, title, content);
        return res.status(200).json({ message: "Email sent successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.sendUserAnEmail = sendUserAnEmail;
