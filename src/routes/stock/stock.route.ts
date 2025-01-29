import express from 'express';
import { 
    createStock,
    fetchStocks,
    fetchStock,
    updateStock,
    removeStock,
    getStockByProduct,
    getStockHistory,
    reorderStock,
    checkStockStatus
} from '../../controllers/stock/stockController';
import { verifyAdminExist, verifySuperAdminToken } from '../../middleware/auth/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/stock/create-stock:
 *   post:
 *     summary: Admin should be able to create a stock if authenticated
 *     responses:
 *       201:
 *         description: Admin should be able to create a stock if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-stock',
    verifySuperAdminToken,
    verifyAdminExist,
    createStock
);

/**
 * @swagger
 * /api/v1/stock/fetch-stocks:
 *   get:
 *     summary: Admin should be able to fetch all stocks if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch all stocks if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-stocks',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchStocks
);

/**
 * @swagger
 * /api/v1/stock/fetch-stock/{id}:
 *   get:
 *     summary: Admin should be able to fetch a stock if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch a stock if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-stock/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchStock
);

/**
 * @swagger
 * /api/v1/stock/update-stock/{id}:
 *   put:
 *     summary: Admin should be able to update a stock if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to update a stock if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-stock/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateStock
);

/**
 * @swagger
 * /api/v1/stock/remove-stock/{id}:
 *   delete:
 *     summary: Admin should be able to delete a stock if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to delete a stock if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/remove-stock/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    removeStock
);

/**
 * @swagger
 * /api/v1/stock/product/{productId}:
 *   get:
 *     summary: Admin should be able to fetch a stock by product if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch a stock by product if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/product/:productId',
    verifySuperAdminToken,
    verifyAdminExist,
    getStockByProduct
);

/**
 * @swagger
 * /api/v1/stock/history/{stockId}:
 *   get:
 *     summary: Admin should be able to fetch stock history if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch stock history if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/history/:stockId',
    verifySuperAdminToken,
    verifyAdminExist,
    getStockHistory
);

/**
 * @swagger
 * /api/v1/stock/reorder:
 *   get:
 *     summary: Admin should be able to reorder stocks if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to reorder stocks if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/reorder',
    verifySuperAdminToken,
    verifyAdminExist,
    reorderStock
);

/**
 * @swagger
 * /api/v1/stock/status:
 *   get:
 *     summary: Admin should be able to check stock status if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to check stock status if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/status',
    verifySuperAdminToken,
    verifyAdminExist,
    checkStockStatus
);

export default router;
