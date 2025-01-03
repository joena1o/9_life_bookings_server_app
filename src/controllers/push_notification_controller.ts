// import admin from './firebase';
// import { Request, Response } from 'express';

// interface NotificationPayload {
//   token: string;
//   title: string;
//   body: string;
// }

// export const sendNotification = async ({ token, title, body }: NotificationPayload): Promise<void> => {
//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log('Notification sent successfully:', response);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// };


// export const sendPush = async (req: Request, res: Response): Promise<any> => {
//     const { token, title, body } = req.body;
//     if (!token || !title || !body) {
//       return res.status(400).send({ error: 'Missing required fields' });
//     }
//     try {
//       await sendNotification({ token, title, body });
//       res.status(200).send({ message: 'Notification sent successfully' });
//     } catch (error) {
//       res.status(500).send({ error: 'Failed to send notification' });
//     }
//   }