import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import StripePayment from '../../../models/payment/stripe/stripe.model';
import mongoose from 'mongoose';
import { Currency, PaymentStatus } from '../../../types/paymentTypes/stripeType/stripeType';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

const createPaymentIntent = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Validate request body
        const { amount, currency } = req.body;

        if (!amount || !currency || !Object.values(Currency).includes(currency)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Valid amount and currency are required." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });
        // saving payments to our mongoDB collection
        const payment = new StripePayment({
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status:PaymentStatus.PENDING,
            lastUpdated: Date.now(),
        });
        await payment.save();
        return res.status(StatusCodes.CREATED).json({
            message: "Stripe payment successful",
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error occurred while processing payment with Stripe:", error);

        // Check if error is an instance of Stripe's APIError
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }

         // Handle MongoDB errors
        if (error instanceof mongoose.Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error saving payment to database." });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

export {
    createPaymentIntent,
};
