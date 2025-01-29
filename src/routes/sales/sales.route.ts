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
 *     summary: An admin should be able to create sales from our API if authenticated
 *     responses:
 *       201:
 *         description: An admin should be able to create sales from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch all sales reports from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch all sales reports from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch a sale report from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to fetch a sale report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to update a sale report from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to update a sale report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to remove a sale report from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sale to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to remove a sale report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch total sales report from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch total sales report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch total sales report of any product if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch total sales report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to filter total sales reports from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to filter total sales reports from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch average sales report from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch average sales report from our API if authenticated  
 *       400:
 *         description: Bad request
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
 *     summary: An admin should be able to fetch all top selling product sales from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch all top selling products from our API if authenticated  
 *       400:
 *         description: Bad request
 */
router.get('/reports/top-selling-product/pdf', 
    verifySuperAdminToken, 
    verifyAdminExist, 
    topSellingProduct
);

export default router;
