import express from 'express';
import { 
    createSuggestion, 
    fetchSuggestions, 
    fetchSuggestion, 
    updateSuggestion, 
    removeSuggestion 
} from '../../controllers/suggestion/suggestionController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
const router = express.Router();

/**
 * @swagger
 * /api/v1/suggestion/create-suggestion:
 *   post:
 *     summary: Create a new suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Suggestion created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create-suggestion',
    schemaValidator('/suggestion/create-suggestion'),
    verifyGeneralApplicationAuthenticationToken,
    createSuggestion
);

/**
 * @swagger
 * /api/v1/suggestion/fetch-suggestions:
 *   get:
 *     summary: Retrieve all suggestions
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of suggestions
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-suggestions', 
    verifyGeneralApplicationAuthenticationToken,
    fetchSuggestions
);

/**
 * @swagger
 * /api/v1/suggestion/fetch-suggestion/{id}:
 *   get:
 *     summary: Retrieve a specific suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID of the suggestion to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion retrieved successfully
 *       404:
 *         description: Suggestion not found
 */
router.get('/fetch-suggestion/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchSuggestion
);

/**
 * @swagger
 * /api/v1/suggestion/update-suggestion/{id}:
 *   put:
 *     summary: Update an existing suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestion updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Suggestion not found
 */
router.put('/update-suggestion/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateSuggestion
);

/**
 * @swagger
 * /api/v1/suggestion/remove-suggestion/{id}:
 *   delete:
 *     summary: Delete a suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID of the suggestion to remove
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Suggestion removed successfully
 *       404:
 *         description: Suggestion not found
 */
router.delete('/remove-suggestion/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeSuggestion
);

export default router;
