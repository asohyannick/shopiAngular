import express from 'express';
import {
    createService,
    uploadServiceImages,
    fetchServices,
    fetchService,
    updateService,
    removeService
} from "../../controllers/services/services.controller";
import { 
    verifySuperAdminToken,
    verifyAdminExist
} from '../../middleware/auth/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/service/create-service:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create-service',
    verifySuperAdminToken,
    verifyAdminExist,
    uploadServiceImages,
    createService
);

/**
 * @swagger
 * /api/v1/service/fetch-services:
 *   get:
 *     summary: Retrieve all services
 *     tags: [Services]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: A list of services
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-services',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchServices
);

/**
 * @swagger
 * /api/v1/service/fetch-service/{id}:
 *   get:
 *     summary: Retrieve a specific service by ID
 *     tags: [Services]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the service to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-service/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchService
);

/**
 * @swagger
 * /api/v1/service/update-service/{id}:
 *   put:
 *     summary: Update a specific service by ID
 *     tags: [Services]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the service to update
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/update-service/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateService
);

/**
 * @swagger
 * /api/v1/service/remove-service/{id}:
 *   delete:
 *     summary: Remove a specific service by ID
 *     tags: [Services]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the service to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service removed successfully
 *       404:
 *         description: Service not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove-service/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    removeService
);

export default router;
