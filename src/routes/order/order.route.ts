import express from 'express';
import { 
    createOrderHistory,
    fetchAllOrderHistories,
    updateOrderHistory,
    orderHistoryDetails,
    fetchUserOrders,
    cancelAnOrder,
    orderHistory,
    deleteOrderHistory,
    pastOrder
} from '../../controllers/order/orderController';
import { 
    verifyGeneralApplicationAuthenticationToken
} from '../../middleware/auth/auth';

const router = express.Router();

// Create all order histories for a user
/**
 * @swagger
 * /api/v1/order/create-orders:
 *   post:
 *     summary: A user should be able to create an order from our API if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to create an order from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-orders',
    verifyGeneralApplicationAuthenticationToken,
    createOrderHistory
);

// Fetch all order histories from the database
/**
 * @swagger
 * /api/v1/order/orders/{id}/histories:
 *   get:
 *     summary: A user should be able to fetch all of his or her order histories from our API if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch all of his or her order histories from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/orders/:id/histories',
    verifyGeneralApplicationAuthenticationToken,
    fetchAllOrderHistories
);

// Fetch a single order history associated with a user
/**
 * @swagger
 * /api/v1/order/orders/{id}/history:
 *   get:
 *     summary: A user should be able to fetch an order history associated with him or her if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch an order history associated with him or her if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/orders/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    orderHistory
);

// Fetch a single order history details 
/**
 * @swagger
 * /api/v1/order/orders-detail/{id}:
 *   get:
 *     summary: A user should be able to fetch a single order history detail associated from our API if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch a single order history detail associated from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/orders-detail/:id',
    verifyGeneralApplicationAuthenticationToken,
    orderHistoryDetails
);

// Fetch order history with a unique user 
/**
 * @swagger
 * /api/v1/order/fetch-orders/{userId}:
 *   get:
 *     summary: A user should be able to fetch order histories associated with a unique user if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch order histories associated with a unique user if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-orders/:userId',
    verifyGeneralApplicationAuthenticationToken,
    fetchUserOrders
);

// Update a single order history
/**
 * @swagger
 * /api/v1/order/update-order/{id}/history:
 *   put:
 *     summary: A user should be able to update a single order history associated with him or her if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to update a single order history if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-order/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    updateOrderHistory
);

// Cancel an order history
/**
 * @swagger
 * /api/v1/order/orders/{id}/cancel:
 *   post:
 *     summary: A user should be able to cancel a single order history from our API if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to cancel an order from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/orders/:id/cancel',
    verifyGeneralApplicationAuthenticationToken,
    cancelAnOrder
);

// Delete an order history
/**
 * @swagger
 * /api/v1/order/order-history/{historyId}:
 *   delete:
 *     summary: A user should be able to delete an order history from our API if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to delete an order history from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/order-history/:historyId',
    verifyGeneralApplicationAuthenticationToken,
    deleteOrderHistory
);

// Fetch past order history of a user
/**
 * @swagger
 * /api/v1/order/orders/history/{userId}:
 *   get:
 *     summary: A user should be able to fetch a single past order history associated to him or her if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch a single past order history from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/orders/history/:userId',
    verifyGeneralApplicationAuthenticationToken,
    pastOrder
);

export default router;
