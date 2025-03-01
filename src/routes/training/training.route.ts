import express from 'express';
import { verifyAdminExist, verifySuperAdminToken } from '../../middleware/auth/auth';
import { createTraining, fetchTraining, fetchTrainings, removeTraining, updateTraining } from '../../controllers/training/training.controller';

const router = express.Router();

/**
 * @swagger
 * /api/v1/training/create-training:
 *   post:
 *     summary: Create a new training session
 *     tags: [Training]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Training created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create-training',
    verifySuperAdminToken,
    verifyAdminExist,
    createTraining
);

/**
 * @swagger
 * /api/v1/training/fetch-trainings:
 *   get:
 *     summary: Retrieve all training sessions
 *     tags: [Training]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: A list of training sessions
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-trainings',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchTrainings
);

/**
 * @swagger
 * /api/v1/training/fetch-training/{id}:
 *   get:
 *     summary: Retrieve a specific training session by ID
 *     tags: [Training]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the training session to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Training session details
 *       404:
 *         description: Training session not found
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-training/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchTraining
);

/**
 * @swagger
 * /api/v1/training/update-training/{id}:
 *   put:
 *     summary: Update a specific training session by ID
 *     tags: [Training]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the training session to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Training session updated successfully
 *       404:
 *         description: Training session not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/update-training/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateTraining
);

/**
 * @swagger
 * /api/v1/training/remove-training/{id}:
 *   delete:
 *     summary: Remove a specific training session by ID
 *     tags: [Training]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the training session to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Training session removed successfully
 *       404:
 *         description: Training session not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove-training/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    removeTraining
);

export default router;
