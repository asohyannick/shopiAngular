import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import { createFeedback, fetchFeedback, fetchFeedbacks, removeFeedback, updateFeedback } from 
'../../controllers/feedback/feedbackController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * /api/v1/feedback/create-feedback:
 *   post:
 *     summary: Create feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/create-feedback',
    schemaValidator('/feedback/create-feedback'),
    verifyGeneralApplicationAuthenticationToken,
    createFeedback
);

/**
 * @swagger
 * /api/v1/feedback/fetch-feedbacks:
 *   get:
 *     summary: Fetch all feedbacks
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched feedbacks
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-feedbacks',
    verifyGeneralApplicationAuthenticationToken,
    fetchFeedbacks
);

/**
 * @swagger
 * /api/v1/feedback/fetch-feedback/{id}:
 *   get:
 *     summary: Fetch feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the feedback to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched feedback
 *       404:
 *         description: Feedback not found
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-feedback/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchFeedback
);

/**
 * @swagger
 * /api/v1/feedback/update-feedback/{id}:
 *   put:
 *     summary: Update feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the feedback to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Feedback not found
 *       401:
 *         description: Unauthorized
 */
router.put('/update-feedback/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateFeedback
);

/**
 * @swagger
 * /api/v1/feedback/remove-feedback/{id}:
 *   delete:
 *     summary: Remove feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the feedback to remove
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Feedback removed successfully
 *       404:
 *         description: Feedback not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove-feedback/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeFeedback
);

export default router;
