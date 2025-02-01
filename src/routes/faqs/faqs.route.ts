import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import { createFAQs, fetchFAQ, fetchFAQs, removeFAQ, updateFAQ } from '../../controllers/faqs/faqsController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/faq/create-faq:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *                 nullable: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               priority:
 *                 type: integer
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Validation error or invalid input
 *       401:
 *         description: Unauthorized - Authentication token required
 *       500:
 *         description: Internal server error
 */
router.post('/create-faq',
    verifyGeneralApplicationAuthenticationToken,
    createFAQs
);

/**
 * @swagger
 * /api/v1/faq/fetch-faqs:
 *   get:
 *     summary: Retrieve all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of FAQs retrieved successfully
 *       401:
 *         description: Unauthorized - Authentication token required
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-faqs',
    verifyGeneralApplicationAuthenticationToken,
    fetchFAQs
);

/**
 * @swagger
 * /api/v1/faq/fetch-faq/{id}:
 *   get:
 *     summary: Retrieve a single FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *       404:
 *         description: FAQ not found
 *       401:
 *         description: Unauthorized - Authentication token required
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-faq/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchFAQ,
);

/**
 * @swagger
 * /api/v1/faq/update-faq/{id}:
 *   put:
 *     summary: Update an existing FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               question:
 *                 type: string
 *                 nullable: true
 *               answer:
 *                 type: string
 *                 nullable: true
 *               category:
 *                 type: string
 *                 nullable: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *               priority:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Validation error or invalid input
 *       404:
 *         description: FAQ not found
 *       401:
 *         description: Unauthorized - Authentication token required
 *       500:
 *         description: Internal server error
 */
router.put('/update-faq/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateFAQ,
);

/**
 * @swagger
 * /api/v1/faq/remove-faq/{id}:
 *   delete:
 *     summary: Remove an FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: FAQ removed successfully
 *       404:
 *         description: FAQ not found
 *       401:
 *         description: Unauthorized - Authentication token required
 *       500:
 *         description: Internal server error
 */
router.delete('/remove-faq/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeFAQ
);

export default router;
