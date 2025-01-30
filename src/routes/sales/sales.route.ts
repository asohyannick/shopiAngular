import express from 'express';
import { 
    createSale,
    fetchSales,
    fetchSale,
    updateSale,
    deleteSale,
    totalSales,
    salesByProduct,
    filterSales,
    averageSales,
    topSellingProduct,
} from '../../controllers/sales/salesController';

import { 
    verifySuperAdminToken,
    verifyAdminExist
} from '../../middleware/auth/auth';

const router = express.Router();
/**
 * @swagger
 * /api/v1/sales/create-sale:
 *   post:
 *     summary: Create a new sale (Admin must be authenticated)
 *     responses:
 *       201:
 *         description: Sale created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create sale.
 */
router.post('/create-sale', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    createSale
);

/**
 * @swagger
 * /api/v1/sales/reports/fetch-sales:
 *   get:
 *     summary: Fetch all sales reports (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Sales reports fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch sales reports.
 */
router.get('/reports/fetch-sales', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    fetchSales
);

/**
 * @swagger
 * /api/v1/sales/reports/fetch-sale/{id}:
 *   get:
 *     summary: Fetch a specific sale report (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale report fetched successfully.
 *       404:
 *         description: Sale report not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch sale report.
 */
router.get('/reports/fetch-sale/:id', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    fetchSale
);

/**
 * @swagger
 * /api/v1/sales/reports/update-sale/{id}:
 *   put:
 *     summary: Update a specific sale report (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale report updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Sale report not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update sale report.
 */
router.put('/reports/update-sale/:id', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    updateSale
);

/**
 * @swagger
 * /api/v1/sales/reports/sales/{id}:
 *   delete:
 *     summary: Remove a specific sale report (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale report deleted successfully.
 *       404:
 *         description: Sale report not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete sale report.
 */
router.delete('/reports/sales/:id', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    deleteSale
);

/**
 * @swagger
 * /api/v1/sales/reports/total-sales/pdf:
 *   get:
 *     summary: Fetch total sales report (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Total sales report fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch total sales report.
 */
router.get('/reports/total-sales/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    totalSales
);

/**
 * @swagger
 * /api/v1/sales/reports/sales-by-product/pdf:
 *   get:
 *     summary: Fetch sales report by product (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Sales report by product fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch sales report by product.
 */
router.get('/reports/sales-by-product/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    salesByProduct
);

/**
 * @swagger
 * /api/v1/sales/reports/sales/pdf:
 *   get:
 *     summary: Filter total sales reports (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Total sales reports filtered successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to filter total sales reports.
 */
router.get('/reports/sales/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    filterSales
);

/**
 * @swagger
 * /api/v1/sales/reports/average-sales/pdf:
 *   get:
 *     summary: Fetch average sales report (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Average sales report fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch average sales report.
 */
router.get('/reports/average-sales/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    averageSales
);

/**
 * @swagger
 * /api/v1/sales/reports/top-selling-product/pdf:
 *   get:
 *     summary: Fetch top-selling product sales report (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Top-selling product sales report fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch top-selling product sales report.
 */
router.get('/reports/top-selling-product/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    topSellingProduct
);

export default router;
