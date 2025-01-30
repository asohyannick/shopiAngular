import express from 'express';
import { requestPromoCode, applyPromoCode } from '../../controllers/promoCode/promoCodeController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
const router = express.Router();
/**
 * @swagger
 * /api/v1/promo-code/request:
 *   post:
 *     summary: Request a promo code (User must be authenticated)
 *     responses:
 *       201:
 *         description: Promo code requested successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to process request.
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
 *     summary: Apply a promo code (User must be authenticated)
 *     responses:
 *       200:
 *         description: Promo code applied successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: Promo code not found or expired.
 *       500:
 *         description: Internal server error. Unable to apply promo code.
 */
router.post(
    '/apply',
    verifyGeneralApplicationAuthenticationToken,
    applyPromoCode
);
export default router;
