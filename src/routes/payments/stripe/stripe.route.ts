import express from 'express';
import { createPaymentIntent } from '../../../controllers/payments/stripe/stripeController';
import { verifyGeneralApplicationAuthenticationToken } from '../../../middleware/auth/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/stripe-payment/create-payment:
 *   post:
 *     summary: Create a payment intent with Stripe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount to charge in cents.
 *               currency:
 *                 type: string
 *                 description: Currency code (e.g., "usd").
 *     responses:
 *       201:
 *         description: Payment intent created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stripe payment successful"
 *                 clientSecret:
 *                   type: string
 *                   example: "pi_1Fxxxxxx_secret_XXXX"
 *       400:
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Amount and currency are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.post(
    '/create-payment',
    verifyGeneralApplicationAuthenticationToken,
    createPaymentIntent
);

export default router;
