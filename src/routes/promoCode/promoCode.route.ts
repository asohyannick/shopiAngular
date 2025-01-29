import express from 'express';
import { requestPromoCode, applyPromoCode } from '../../controllers/promoCode/promoCodeController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/promo-code/request:
 *   post:
 *     summary: A user should be able to request a promo code from our API if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to request a promo code from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post(
    '/request',
    verifyGeneralApplicationAuthenticationToken,
    requestPromoCode
);

/**
 * @swagger
 * /api/v1/promo-code/apply:
 *   post:
 *     summary: A user should be able to apply a promo code from our API if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to apply a promo code from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post(
    '/apply',
    verifyGeneralApplicationAuthenticationToken,
    applyPromoCode
);

export default router;
