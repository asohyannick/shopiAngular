import express from 'express';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import {
    createContact,
    fetchContacts,
    fetchContact,
    updateContact,
    removeContact
} from '../../controllers/contactMe/contactMeController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API endpoints for managing contacts
 */

/**
 * @swagger
 * /api/v1/contact-me/create-contact:
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     description: This endpoint allows you to create a new contact in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post('/create-contact',
    schemaValidator("/contact-me/create-contact"),
    verifyGeneralApplicationAuthenticationToken,
    createContact
);

/**
 * @swagger
 * /api/v1/contact-me/fetch-contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Retrieve all contacts
 *     description: This endpoint returns a list of all contacts.
 *     responses:
 *       200:
 *         description: A list of contacts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/fetch-contacts',
    verifyGeneralApplicationAuthenticationToken,
    fetchContacts
);

/**
 * @swagger
 * /api/v1/contact-me/fetch-contact/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Retrieve a specific contact by ID
 *     description: This endpoint returns a single contact by the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/fetch-contact/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchContact
);

/**
 * @swagger
 * /api/v1/contact-me/update-contact/{id}:
 *   put:
 *     tags: [Contacts]
 *     summary: Update a specific contact
 *     description: This endpoint allows you to update a contact by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to update
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/update-contact/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateContact
);

/**
 * @swagger
 * /api/v1/contact-me/remove-contact/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete a specific contact
 *     description: This endpoint allows you to delete a contact by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/remove-contact/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeContact
);

export default router;
