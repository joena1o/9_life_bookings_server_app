import dotenv from "dotenv";
dotenv.config();
import axios, { AxiosRequestHeaders } from "axios";

// Import necessary environment variables
import { app_id, server_token } from "./conn";

// Define the types for the functions
interface NotificationContent {
  en: string;
}

interface NotificationRequest {
  app_id: string;
  headings?: NotificationContent;
  contents?: NotificationContent;
  included_segments?: string[];
  filters?: Array<{
    field: string;
    key: string;
    relation: string;
    value: string;
  }>;
  include_external_user_ids?: string[];
  target_channel?: string;
  channel_for_external_user_ids?: string;
  isAndroid?: boolean;
  content_available?: boolean;
  big_picture?: string
}

// Define reusable headers

// Send notification to all subscribers
export const sendAllSubscriberNotification = async (
  title: string,
  body: string
): Promise<void> => {
  try {
    const requestBody: NotificationRequest = {
      app_id,
      included_segments: ["All"],
      contents: { en: body },
      headings: { en: title },
    };

    await axios.post("https://onesignal.com/api/v1/notifications", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${server_token}`,
      },
    });
    console.log("Notification sent to all subscribers.");
  } catch (e: any) {
    console.error("Error sending notification:", e.response?.data || e.message);
  }
};

// Send notification to users with specific tags
export const sendNotificationToTags = async (
  title: string,
  body: string,
  key: string,
  value: string
): Promise<void> => {
  try {
    const requestBody: NotificationRequest = {
      app_id,
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

    await axios.post("https://onesignal.com/api/v1/notifications", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${server_token}`,
      },
    });
    console.log(`Notification sent to users with tag ${key}=${value}.`);
  } catch (e: any) {
    console.error("Error sending notification:", e.response?.data || e.message);
  }
};

// Send notification to a specific user
export const sendNotificationToUser = async (
  title: string,
  body: string,
  userId: string,
  image?: string
): Promise<void> => {
  try {
    const requestBody: NotificationRequest = image != null ? {
      app_id,
      headings: { en: title },
      contents: { en: body },
      include_external_user_ids: [userId],
      target_channel: "push",
      channel_for_external_user_ids: "push",
      isAndroid: true,
      content_available: true,
      big_picture: image
    }: {
      app_id,
      headings: { en: title },
      contents: { en: body },
      include_external_user_ids: [userId],
      target_channel: "push",
      channel_for_external_user_ids: "push",
      isAndroid: true,
      content_available: true,
    };

    await axios.post("https://onesignal.com/api/v1/notifications", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${server_token}`,
      },
    });
    console.log(`Notification sent to user with ID: ${userId}.`);
  } catch (e: any) {
    console.error("Error sending notification:", e.response?.data || e.message);
  }
};
