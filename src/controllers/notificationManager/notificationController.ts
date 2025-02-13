import { delay } from "../../utils/timerHelper/delay";
import fetchAllUserEmails from "../../utils/emailHelper/retrieveAllEmails";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../../utils/emailHelper/emailService";
import Auth from "../../models/auth/auth.model";
import axios from "axios";
const notifyAllUsers = async(req:Request, res:Response): Promise<Response> => {
const {subject, text} = req.body;
if (!subject || !text) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: "Subject and text are required"});
}
try {
    const userEmails = await fetchAllUserEmails();
    const delayBetweenEmails:number = 1000;
    for(const email of userEmails) {
        await sendEmail(email, subject, text); // Send email
        await delay(delayBetweenEmails); // wait before sending the next email 
    } 
    return res.status(StatusCodes.OK).json({message: "Notifications has been sent to you successfully", userEmails});
} catch (error) {
    console.log("Error occur while sending emails from the database to our users...", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

const registerNotificationFCMToken = async(req:Request, res:Response): Promise<Response> => {
    const {email, fcmToken } = req.body;
    if(!email || !fcmToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Email and FCM Token is required"});
    }
  try {
    const  user = await Auth.findOneAndUpdate(
        {email},
        {fcmToken},
        {new: true, upsert: true}
    );
    return res.status(StatusCodes.OK).json({message: "FCM token has been registered successfully.", user});
  } catch (error) {
    console.log("Error occur while registering  the FCM  token after a user signup...", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
  }
}

const sendPushNotifications = async(res: Response, title: string, body: string): Promise<Response | void> => {
 try {
    const user = await Auth.find();
    const tokens = user.map(user => user.fcmToken).filter(Boolean);
    if (tokens.length === 0) {
        console.log('No FCM token to sent notifications.');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "No FCM token available"});
    }
    const message = {
        registration_ids: tokens,
        notification:{
            title,
            body
        },
    }
    const response = await axios.post(`${process.env.FIREBASE_CLOUD_MESSAGING_CONNECTION_STRING as string}`, message, {
      headers:{
        "Authorization": `key=${process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY as string}`,
        "Content-Type": "application/json",
      },
    });
    return res.status(StatusCodes.OK).json({ 
        message: "Push notifications have been sent successfully",
        response: response.data 
    });
 } catch (error) {
    console.log("Error occur while sending push notifications to the client...", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}
export {
    notifyAllUsers,
    registerNotificationFCMToken,
    sendPushNotifications
}
