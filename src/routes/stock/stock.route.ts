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
 *     summary: Create a new stock (Admin only)
 *     responses:
 *       201:
 *         description: Stock created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create stock.
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
 *     summary: Fetch all stocks (Admin only)
 *     responses:
 *       200:
 *         description: Stocks fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch stocks.
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
 *     summary: Fetch a specific stock by ID (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the stock to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock fetched successfully.
 *       404:
 *         description: Stock not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch stock.
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
 *     summary: Update a specific stock by ID (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the stock to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Stock not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update stock.
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
 *     summary: Delete a specific stock by ID (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the stock to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock deleted successfully.
 *       404:
 *         description: Stock not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete stock.
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
 *     summary: Fetch stock by product ID (Admin only)
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to fetch stock for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock fetched successfully for the specified product.
 *       404:
 *         description: Product not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch stock.
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
 *     summary: Fetch stock history by stock ID (Admin only)
 *     parameters:
 *       - name: stockId
 *         in: path
 *         required: true
 *         description: ID of the stock to fetch history for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock history fetched successfully.
 *       404:
 *         description: Stock not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch stock history.
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
 *     summary: Reorder stocks (Admin only)
 *     responses:
 *       200:
 *         description: Stocks reordered successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to reorder stocks.
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
 *     summary: Check stock status (Admin only)
 *     responses:
 *       200:
 *         description: Stock status fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to check stock status.
 */
router.get('/status',
    verifySuperAdminToken,
    verifyAdminExist,
    checkStockStatus
);
export default router;
