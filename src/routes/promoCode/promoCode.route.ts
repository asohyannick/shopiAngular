import express from 'express';
import { requestPromoCode, applyPromoCode } from '../../controllers/promoCode/promoCodeController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
const router = express.Router();
router.post(
    '/request',
    verifyGeneralApplicationAuthenticationToken,
    requestPromoCode
);
router.post(
    '/apply',
    verifyGeneralApplicationAuthenticationToken,
    applyPromoCode
)
export default router;
