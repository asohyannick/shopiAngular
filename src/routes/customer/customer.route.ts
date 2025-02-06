import express from "express";
import { verifySuperAdminToken, verifyAdminExist } from "../../middleware/auth/auth";
import { 
    createCustomer,
    customerLogin,
    fetchCustomers, 
    fetchCustomer, 
    updateCustomer, 
    deleteCustomer,
    customerSupport,
} from "../../controllers/customer/customerController";
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();
/**
 * @swagger
 * /api/v1/customer/create-customer:
 *   post:
 *     summary: Create a customer account (Admin must be authenticated)
 *     responses:
 *       201:
 *         description: Customer account created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create customer account.
 */
router.post('/create-customer',
    schemaValidator('/customer/create-customer'),
    verifySuperAdminToken,
    verifyAdminExist,
    createCustomer
);

/**
 * @swagger
 * /api/v1/customer/customer-login:
 *   post:
 *     summary: Login a customer into their account (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Customer logged in successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to login customer.
 */
router.post('/customer-login',
    verifySuperAdminToken,
    verifyAdminExist,
    customerLogin
);

/**
 * @swagger
 * /api/v1/customer/fetch-customers:
 *   get:
 *     summary: Fetch all customers (Admin must be authenticated)
 *     responses:
 *       200:
 *         description: Customers fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch customers.
 */
router.get('/fetch-customers',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomers
);

/**
 * @swagger
 * /api/v1/customer/fetch-customer/{id}:
 *   get:
 *     summary: Fetch a specific customer (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer fetched successfully.
 *       404:
 *         description: Customer not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch customer.
 */
router.get('/fetch-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomer
);

/**
 * @swagger
 * /api/v1/customer/update-customer/{id}:
 *   put:
 *     summary: Update a specific customer (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Customer not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update customer.
 */
router.put('/update-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateCustomer
);

/**
 * @swagger
 * /api/v1/customer/remove-customer/{id}:
 *   delete:
 *     summary: Delete a specific customer (Admin must be authenticated)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully.
 *       404:
 *         description: Customer not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete customer.
 */
router.delete('/remove-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteCustomer
);

/**
 * @swagger
 * /api/v1/customer/customer-support:
 *   post:
 *     summary: Submit a customer support request
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Support request submitted successfully
 *       400:
 *         description: Validation error or invalid input
 *       401:
 *         description: Unauthorized - Super admin token required
 *       500:
 *         description: Internal server error
 */

router.post('/customer-support',
    verifySuperAdminToken,
    customerSupport
)
export default router;
