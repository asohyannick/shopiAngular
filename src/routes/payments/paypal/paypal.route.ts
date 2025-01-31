import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../../middleware/auth/auth';
import { createPayment, paymentSucceeded } from '../../../controllers/payments/paypal/paypalController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/paypal-payment/create-payment:
 *   post:
 *     summary: Create a PayPal payment
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
 *                 type: number
 *                 description: The amount to be paid
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 approvalUrl:
 *                   type: string
 *                   description: The URL to redirect the user for payment approval
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
router.post('/create-payment',
    verifyGeneralApplicationAuthenticationToken,
    createPayment
);

/**
 * @swagger
 * /api/v1/paypal-payment/success:
 *   get:
 *     summary: Handle successful payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment
 *       - in: query
 *         name: PayerID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payer
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 payment:
 *                   type: object
 *                   description: Payment details
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
router.get('/success',
    verifyGeneralApplicationAuthenticationToken,
    paymentSucceeded
);

export default router;
