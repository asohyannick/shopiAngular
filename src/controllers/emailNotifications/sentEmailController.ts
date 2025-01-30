import { delay } from "../../utils/timerHelper/delay";
import fetchAllUserEmails from "../../utils/emailHelper/retrieveAllEmails";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../../utils/emailHelper/emailService";

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
    return res.status(StatusCodes.OK).json({message: "Notifications has been sent to you successfully"});
} catch (error) {
    console.log("Error occur while sending emails from the database to our users...", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
}
}

export {
    notifyAllUsers
}
