import paypal from "../../../config/paypalConfig/paypalConfig";
import PayPalTransaction from "../../../models/payment/paypal/paypal.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PayPalPaymentStatus } from "../../../types/paymentTypes/paypalType/paypalType";

const createPayment = async(req:Request, res:Response) => {
 const {amount} = req.body;
 const create_payment_json = {
    intent: 'sale',
    payer:{
        payment_method: 'paypal',
    },
    redirect_urls:{
        redirect_url: process.env.PAYPAL_REDIRECT_URL  as string,
        cancel_url: process.env.PAYPAL_CANCEL_URL as string,
    },
    transactions:[{
        amount:{
            currency: 'USD',
            total: amount,
        },
        description: 'Payment description',
    }],
 }
 paypal.payment.create(create_payment_json, async(error, payment) => {
    if(error instanceof Error) {
       console.error(error);
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong", error: error.message});
    } else {
        // Save payment details to MongoDB
        const paymentDoc = new PayPalTransaction({
            paymentId: payment.id,
            amount,
            status:PayPalPaymentStatus.CREATED, 
        });
        await paymentDoc.save();
        // Return approval URL
        const approvalURL = payment.links?.find(link => link.rel === 'approval_url');
        if (approvalURL) {
            return res.status(StatusCodes.OK).json({approvalURL: approvalURL.href});
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Approval URL not found"});
        }
    }
 })
}

const paymentSucceeded = async(req:Request, res:Response) => {
   const { paymentId, PayerID} = req.query;
   if(typeof PayerID !== 'string') {
      return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid Payer ID"});
   }
   const execute_payment_json = {
        payer_id: PayerID,
        transactions: [{
            amount: {
                currency: 'USD',
                total: req.body.amount, // Adjust as necessary
            },
        }],
    };
   paypal.payment.execute(paymentId as string, execute_payment_json, async(error, payment) => {
    if (error instanceof Error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong", error: error.message});    
    } else {
        // Update payment status in MongoDB
        await PayPalTransaction.findOneAndUpdate(
            {paymentId: payment.id},
            {status: PayPalPaymentStatus.SUCCESS},
            {new: true}
        );
        return res.status(StatusCodes.OK).json({message: "Payment completed successfully", payment});
    }
   })
}

export {
    createPayment,
    paymentSucceeded
}
