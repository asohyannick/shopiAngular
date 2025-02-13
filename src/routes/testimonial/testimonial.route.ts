import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import { 
    createTestimonial, 
    // uploadImages,
    fetchTestimonial, 
    fetchTestimonials,
    updateTestimonial,
    removeTestimonial
} from '../../controllers/testimonial/testimonialController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * /api/v1/testimonial/create-testimonial:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []  # Using bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               message:
 *                 type: string
 *                 example: "This is a fantastic service!"
 *               rating:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/create-testimonial',
    schemaValidator('/testimonial/create-testimonial'),
    verifyGeneralApplicationAuthenticationToken,
    // uploadImages,
    createTestimonial
);

/**
 * @swagger
 * /api/v1/testimonial/fetch-testimonials:
 *   get:
 *     summary: Retrieve all testimonials
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   message:
 *                     type: string
 *                   rating:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-testimonials',
    verifyGeneralApplicationAuthenticationToken,
    fetchTestimonials,
);

/**
 * @swagger
 * /api/v1/testimonial/fetch-testimonial/{id}:
 *   get:
 *     summary: Retrieve a single testimonial by ID
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the testimonial
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single testimonial
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 message:
 *                   type: string
 *                 rating:
 *                   type: integer
 *       404:
 *         description: Testimonial not found
 *       401:
 *         description: Unauthorized
 */
router.get('/fetch-testimonial/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchTestimonial,
);

/**
 * @swagger
 * /api/v1/testimonial/update-testimonial/{id}:
 *   put:
 *     summary: Update an existing testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the testimonial
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
 *                 example: "Jane Doe"
 *               message:
 *                 type: string
 *                 example: "Updated message."
 *               rating:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Testimonial not found
 *       401:
 *         description: Unauthorized
 */
router.put('/update-testimonial/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateTestimonial,
);

/**
 * @swagger
 * /api/v1/testimonial/remove-testimonial/{id}:
 *   delete:
 *     summary: Remove a testimonial by ID
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the testimonial to remove
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Testimonial deleted successfully
 *       404:
 *         description: Testimonial not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove-testimonial/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeTestimonial
);

export default router;
