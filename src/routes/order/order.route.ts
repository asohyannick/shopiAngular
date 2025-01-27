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
// Create all orders histories for a user
router.post('/create-orders',
    verifyGeneralApplicationAuthenticationToken,
   createOrderHistory
);
// Fetch all orders histories from the database
router.get('/orders/:id/histories',
    verifyGeneralApplicationAuthenticationToken,
    fetchAllOrderHistories
);

// Fetch a single order history associated with a user
router.get('/orders/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    orderHistory
)
// Fetch a single order history details 
router.get('/orders-detail/:id',
    verifyGeneralApplicationAuthenticationToken,
    orderHistoryDetails
);
// Fetch a  order history with a unique user 
router.get('/fetch-orders/:userId',
    verifyGeneralApplicationAuthenticationToken,
    fetchUserOrders
);
//  Update a single order history
router.put('/update-order/:id/history',
    verifyGeneralApplicationAuthenticationToken,
    updateOrderHistory
);

// cancel an order history
router.post('/orders/:id/cancel',
    verifyGeneralApplicationAuthenticationToken,
    cancelAnOrder
);

// delete an order history
router.delete('orders/history/:historyId',
    verifyGeneralApplicationAuthenticationToken,
    deleteOrderHistory
);

// Fetch past order history of a user
router.get('/orders/history/:userId',
    verifyGeneralApplicationAuthenticationToken,
    pastOrder
);
export default router;
