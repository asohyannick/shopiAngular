import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import { 
    createShippingMethod, 
    fetchShippingMethod, 
    fetchShippingMethods, 
    updateShippingMethod,
    removeShippingMethod, 
} from '../../controllers/shipping/shippingController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * /api/v1/shipping/create-shipping:
 *   post:
 *     summary: Create a new shipping method
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               estimatedDeliveryTime:
 *                 type: string
 *               carrier:
 *                 type: string
 *               trackingAvailable:
 *                 type: boolean
 *               international:
 *                 type: boolean
 *               maxWeightLimit:
 *                 type: number
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *     responses:
 *       201:
 *         description: Shipping method created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/create-shipping',
    schemaValidator('/shipping/create-shipping'),
    verifyGeneralApplicationAuthenticationToken,
    createShippingMethod
);

/**
 * @swagger
 * /api/v1/shipping/fetch-shippings:
 *   get:
 *     summary: Retrieve all shipping methods
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: List of shipping methods
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-shippings',
    verifyGeneralApplicationAuthenticationToken,
    fetchShippingMethods
);

/**
 * @swagger
 * /api/v1/shipping/fetch-shipping/{id}:
 *   get:
 *     summary: Retrieve a specific shipping method by ID
 *     tags: [Shipping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the shipping method
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipping method retrieved successfully
 *       404:
 *         description: Shipping method not found
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-shipping/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchShippingMethod,
);

/**
 * @swagger
 * /api/v1/shipping/update-shipping/{id}:
 *   put:
 *     summary: Update a shipping method by ID
 *     tags: [Shipping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the shipping method
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               estimatedDeliveryTime:
 *                 type: string
 *               carrier:
 *                 type: string
 *               trackingAvailable:
 *                 type: boolean
 *               international:
 *                 type: boolean
 *               maxWeightLimit:
 *                 type: number
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *     responses:
 *       200:
 *         description: Shipping method updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Shipping method not found
 *       401:
 *         description: Unauthorized
 */
router.put('/update-shipping/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateShippingMethod,
);

/**
 * @swagger
 * /api/v1/shipping/remove-shipping/{id}:
 *   delete:
 *     summary: Remove a shipping method by ID
 *     tags: [Shipping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the shipping method
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Shipping method deleted successfully
 *       404:
 *         description: Shipping method not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove-shipping/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeShippingMethod
);

export default router;
