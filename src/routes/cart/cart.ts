import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import {
    addProductToCart, 
    updateProductQuantity,
    removeProductFromCart,
    clearCart
 } from '../../controllers/shoppingCart/shoppingCartController';
const router = express.Router();
router.post('/add-cart',
    verifyGeneralApplicationAuthenticationToken,
    addProductToCart
);
router.put('/update-cart',
    verifyGeneralApplicationAuthenticationToken,
    updateProductQuantity
);
router.delete('/remove-cart-item',
    verifyGeneralApplicationAuthenticationToken,
    removeProductFromCart
);
router.delete('/clear-cart/:userId',
    verifyGeneralApplicationAuthenticationToken,
    clearCart
);
export default router;
