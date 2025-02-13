import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import {
    addProductToCart, 
    updateProductQuantity,
    removeProductFromCart,
    clearCart
} from '../../controllers/shoppingCart/shoppingCartController';

const router = express.Router();
/**
 * @swagger
 * /api/v1/shopping-cart/add-to-cart:
 *   post:
 *     summary: Add a product to the shopping cart (User must be authenticated)
 *     responses:
 *       201:
 *         description: Product added to the shopping cart successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to add product to cart.
 */
router.post('/add-to-cart',
    verifyGeneralApplicationAuthenticationToken,
    addProductToCart
);

/**
 * @swagger
 * /api/v1/shopping-cart/update-cart:
 *   put:
 *     summary: Update a product in the shopping cart (User must be authenticated)
 *     responses:
 *       200:
 *         description: Product updated in the shopping cart successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update product in cart.
 */
router.put('/update-cart',
    verifyGeneralApplicationAuthenticationToken,
    updateProductQuantity
);

/**
 * @swagger
 * /api/v1/shopping-cart/remove-cart-item/:id:
 *   delete:
 *     summary: Remove a product from the shopping cart (User must be authenticated)
 *     responses:
 *       200:
 *         description: Product removed from the shopping cart successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to remove product from cart.
 */
router.delete('/remove-cart-item/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeProductFromCart
);

/**
 * @swagger
 * /api/v1/shopping-cart/clear-cart/{id}:
 *   delete:
 *     summary: Clear all products from the shopping cart (User must be authenticated)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose cart should be cleared.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shopping cart cleared successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: User not found. Please check the user ID.
 *       500:
 *         description: Internal server error. Unable to clear cart.
 */
router.delete('/clear-cart/:id',
    verifyGeneralApplicationAuthenticationToken,
    clearCart
);
export default router;
