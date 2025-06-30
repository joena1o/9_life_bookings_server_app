"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToUser = exports.sendNotificationToTags = exports.sendAllSubscriberNotification = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
// Import necessary environment variables
const conn_1 = require("./conn");
// Define reusable headers
// Send notification to all subscribers
const sendAllSubscriberNotification = async (title, body) => {
    try {
        const requestBody = {
            app_id: conn_1.app_id,
            included_segments: ["All"],
            contents: { en: body },
            headings: { en: title },
        };
        await axios_1.default.post("https://onesignal.com/api/v1/notifications", requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${conn_1.server_token}`,
            },
        });
        console.log("Notification sent to all subscribers.");
    }
    catch (e) {
        console.error("Error sending notification:", e.response?.data || e.message);
    }
};
exports.sendAllSubscriberNotification = sendAllSubscriberNotification;
// Send notification to users with specific tags
const sendNotificationToTags = async (title, body, key, value) => {
    try {
        const requestBody = {
            app_id: conn_1.app_id,
            headings: { en: title },
            contents: { en: body },
            filters: [
                {
                    field: "tag",
                    key,
                    relation: "=",
                    value,
                },
            ],
        };
        await axios_1.default.post("https://onesignal.com/api/v1/notifications", requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${conn_1.server_token}`,
            },
        });
        console.log(`Notification sent to users with tag ${key}=${value}.`);
    }
    catch (e) {
        console.error("Error sending notification:", e.response?.data || e.message);
    }
};
exports.sendNotificationToTags = sendNotificationToTags;
// Send notification to a specific user
const sendNotificationToUser = async (title, body, userId, image) => {
    try {
        const requestBody = image != null ? {
            app_id: conn_1.app_id,
            headings: { en: title },
            contents: { en: body },
            include_external_user_ids: [userId],
            target_channel: "push",
            channel_for_external_user_ids: "push",
            isAndroid: true,
            content_available: true,
            big_picture: image
        } : {
            app_id: conn_1.app_id,
            headings: { en: title },
            contents: { en: body },
            include_external_user_ids: [userId],
            target_channel: "push",
            channel_for_external_user_ids: "push",
            isAndroid: true,
            content_available: true,
        };
        await axios_1.default.post("https://onesignal.com/api/v1/notifications", requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${conn_1.server_token}`,
            },
        });
        console.log(`Notification sent to user with ID: ${userId}.`);
    }
    catch (e) {
        console.error("Error sending notification:", e.response?.data || e.message);
    }
};
exports.sendNotificationToUser = sendNotificationToUser;
