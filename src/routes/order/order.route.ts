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
/**
 * @swagger
 * /api/v1/order/create-orders:
 *   post:
 *     summary: Create a new order (User must be authenticated)
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create order.
 */
router.post('/create-orders',
    verifyGeneralApplicationAuthenticationToken,
    createOrderHistory
);

/**
 * @swagger
 * /api/v1/order/orders/{id}/histories:
 *   get:
 *     summary: Fetch all order histories for a user (User must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user whose order histories to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order histories fetched successfully.
 *       404:
 *         description: User not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch order histories.
 */
router.get('/orders/:id/histories',
    verifyGeneralApplicationAuthenticationToken,
    fetchAllOrderHistories
);

/**
 * @swagger
 * /api/v1/order/orders/{id}/history:
 *   get:
 *     summary: Fetch a specific order history for a user (User must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order history to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history fetched successfully.
 *       404:
 *         description: Order history not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch order history.
 */
router.get('/orders/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    orderHistory
);

/**
 * @swagger
 * /api/v1/order/orders-detail/{id}:
 *   get:
 *     summary: Fetch details of a specific order history (User must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order history detail to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history details fetched successfully.
 *       404:
 *         description: Order history not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch order history details.
 */
router.get('/orders-detail/:id',
    verifyGeneralApplicationAuthenticationToken,
    orderHistoryDetails
);

/**
 * @swagger
 * /api/v1/order/fetch-orders/{userId}:
 *   get:
 *     summary: Fetch all order histories for a specific user (User must be authenticated)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose order histories to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's order histories fetched successfully.
 *       404:
 *         description: User not found. Please check the user ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch order histories.
 */
router.get('/fetch-orders/:userId',
    verifyGeneralApplicationAuthenticationToken,
    fetchUserOrders
);

/**
 * @swagger
 * /api/v1/order/update-order/{id}/history:
 *   put:
 *     summary: Update a specific order history (User must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order history to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Order history not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update order history.
 */
router.put('/update-order/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    updateOrderHistory
);

/**
 * @swagger
 * /api/v1/order/orders/{id}/cancel:
 *   post:
 *     summary: Cancel a specific order history (User must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order history to cancel.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history canceled successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Order history not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to cancel order history.
 */
router.post('/orders/:id/cancel',
    verifyGeneralApplicationAuthenticationToken,
    cancelAnOrder
);

/**
 * @swagger
 * /api/v1/order/order-history/{historyId}:
 *   delete:
 *     summary: Delete a specific order history (User must be authenticated)
 *     parameters:
 *       - name: historyId
 *         in: path
 *         required: true
 *         description: ID of the order history to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history deleted successfully.
 *       404:
 *         description: Order history not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete order history.
 */
router.delete('/order-history/:historyId',
    verifyGeneralApplicationAuthenticationToken,
    deleteOrderHistory
);

/**
 * @swagger
 * /api/v1/order/orders/history/{userId}:
 *   get:
 *     summary: Fetch past order history for a user (User must be authenticated)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user whose past order history to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Past order history fetched successfully.
 *       404:
 *         description: User not found. Please check the user ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch past order history.
 */
router.get('/orders/history/:userId',
    verifyGeneralApplicationAuthenticationToken,
    pastOrder
);
export default router;
