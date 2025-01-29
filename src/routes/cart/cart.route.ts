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
 * /api/v1/shopping-cart/add-cart:
 *   post:
 *     summary: A user should be able to add a product to his or her shopping cart in our database if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to add a product to his or her shopping cart in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/add-cart',
    verifyGeneralApplicationAuthenticationToken,
    addProductToCart
);

/**
 * @swagger
 * /api/v1/shopping-cart/update-cart:
 *   put:
 *     summary: A user should be able to update a product in his or her shopping cart in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to update a product in his or her shopping cart in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-cart',
    verifyGeneralApplicationAuthenticationToken,
    updateProductQuantity
);

/**
 * @swagger
 * /api/v1/shopping-cart/remove-cart-item:
 *   delete:
 *     summary: A user should be able to remove a product from his or her shopping cart in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to remove a product from his or her shopping cart in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/remove-cart-item',
    verifyGeneralApplicationAuthenticationToken,
    removeProductFromCart
);

/**
 * @swagger
 * /api/v1/shopping-cart/clear-cart/{userId}:
 *   delete:
 *     summary: A user should be able to clear products from his or her shopping cart in our database if authenticated
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose cart should be cleared
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user should be able to clear products from his or her shopping cart in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/clear-cart/:userId',
    verifyGeneralApplicationAuthenticationToken,
    clearCart
);

export default router;
